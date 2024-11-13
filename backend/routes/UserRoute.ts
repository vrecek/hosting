import express, {Router, Request, Response} from 'express'
import Server, { i } from '../Server'
import path from 'path'
import User from '../models/User'
import UserSchema, { CollectionFile, CollectionFolder, CollectionMovie, PossibleItem } from '../interfaces/UserSchema'
import jwt from 'jsonwebtoken'
import JWTAuth from '../middleware/JWTAuth'
import findFolder from '../utils/findFolder'
import findUpdateString from '../utils/findUpdateString'
import getFiletype from '../utils/getFiletype'
import ffprobe from '../utils/ffprobeFile'
import ffmpeg from 'fluent-ffmpeg'
import fs from 'fs/promises'
import mongoose from 'mongoose'
import makeThumbnail from '../utils/makeThumbnail'
import File from '../models/File'
import loopFolders from '../utils/loopFolders'
import { FileItems } from '../interfaces/FileSchema'
import rmAndRes from '../utils/removeAndResponse'


const UserRoute: Router = express.Router()


UserRoute.get('/auth', JWTAuth, async (req: Request, res: Response) => {
    try
    {
        const user = await User.findById(req.id)
                               .select('-password')
                               .lean()

        if (user)
        {
            const protohost: string = Server.getProtocolHost(req)

            loopFolders(user.saved, (x: PossibleItem) => {
                if (x.itemtype === 'movie')
                {
                    const thumbnail: string = (x as CollectionMovie).thumbnail;
                    (x as CollectionMovie).thumbnail = `${protohost}/files/${req.id}/thumbnails/${thumbnail}`
                }
            })
        }
            
        res.status(200).json(user)
    }
    catch
    {
        res.status(500).json({ msg: 'Could not authenticate the user' })
    }
})

UserRoute.post('/register', async (req: Request, res: Response) => {
    const {username, mail, password, confirm_password, checkbox, captcha} = req.body,
           errArr: string[] = []

           
    Server.validateUsername(username, 3, 12, errArr)
    Server.validateMail(mail, errArr)
    Server.validatePassword(6, password, confirm_password, errArr)
    !checkbox && errArr.push('You must accept our ToS')
    await Server.validateCaptcha(captcha, process.env.CAPTCHA!, errArr)


    if (errArr.length)
        return res.status(400).json({ msg: errArr[0] })

    try
    {
        const [doesUser, doesMail] = await Promise.all([
            User.exists({username}),
            User.exists({mail})
        ])
    
        if (doesUser)
            return res.status(400).json({ msg: 'Username already exists'})
        if (doesMail)
            return res.status(400).json({ msg: 'Mail already exists'})
    
        
        const userID: string = new mongoose.Types.ObjectId().toString()

        const newUser = new User({
            _id: userID,
            username,
            mail,
            password: Server.hash(process.env.HASHKEY!, password)
        })
        const newFile = new File({ ownerID: userID })

        await Promise.all([
            newUser.save(),
            newFile.save()
        ])

        res.status(201).json({ msg: 'Successfully created' })

    }
    catch (err: any)
    {
        console.log(err)
        res.status(500).json({ msg: 'An error occured during creation of the user'})
    }
})

UserRoute.post('/signin', async (req: Request, res: Response) => {
    const {username, password, remember} = req.body

    try 
    {
        const user: UserSchema | null = await User.findOne({username})
                                                  .select('password')
                                                  .lean()

        if (!user || !Server.verifyHash(process.env.HASHKEY!, user.password, password))
            return res.status(400).json({ msg: 'Username or password is incorrect' })


        const expire: number = remember ? Server.MONTH : Server.HOUR
        const token:  string = jwt.sign(
            { id: user._id.toString() },
            process.env.JWTKEY!,
            { expiresIn: expire, algorithm: 'HS256' }
        )

        res.cookie('token', token, {
            signed: true,
            httpOnly: true,
            maxAge: expire
        })

        res.status(200).json({ msg: "Successfully logged in "})

    }
    catch
    {
        return res.status(500).json({ msg: 'Could not log in'})
    }
})

UserRoute.post('/logout', JWTAuth, (req: Request, res: Response) => {
    res.clearCookie('token')
    req.id = undefined

    res.status(200).json({ msg: 'Logged out' })
})

UserRoute.post('/new-file', JWTAuth, async (req: Request, res: Response) => {
    const user_uploads: string = path.join(__dirname, '..', '..', 'uploads', `${req.id}`),
          file_id:      string = new mongoose.Types.ObjectId().toString()

    await Server.mkdir([user_uploads])

    const fu  = new Server.FileUpload(null, ['.exe'])
    const up  = fu.multerImageUpload(
        'disk', 
        Server.GiB * 2, 
        'fileitem', 
        'single', 
        user_uploads,
        (file) => `${file_id}${path.extname(file.originalname)}`
    )

    up(req, res, async (err: any) => {
        const error = fu.multerImageUploadError(err, res, req)
        if (error) return error


        const {currentTree, filename, note, isMovie} = req.body,
              file:   Express.Multer.File = req.file!,
              ext:    string = path.extname(file.originalname),
              f_name: string = `${filename}${ext}`

        let thumb_file_loc: i.Maybe<string>,
            f_dest:         string = `${file.destination}/${file.filename}`

        
        if (isMovie && ext !== '.mp4' && ext !== '.webm')
            return await rmAndRes(res, f_dest, 'Movie must be in a .mp4 or .webm format')

        if (!currentTree || !filename)
            return await rmAndRes(res, f_dest, 'Invalid body object')

        try
        {
            const user = await User.findOne({ _id: req.id })
                                   .select('saved')
                                   .lean()

            if (Server.sanitizedString(filename))
                return await rmAndRes(res, f_dest, 'Invalid file name')

            if (!findFolder(user!.saved[0], currentTree))
                return await rmAndRes(res, f_dest, 'Folder does not exist')


            let itemObj:    CollectionFile | Omit<CollectionMovie, 'thumbnail'>,
                thumb_name: i.Maybe<string> = undefined,
                varObj:     any = {}
        
            const mongoID:  mongoose.Types.ObjectId = new mongoose.Types.ObjectId(),
                  objectID: string = mongoID.toString(),
                  created:  number = Date.now()

            const comObj = {
                _id: mongoID,
                itemtype: isMovie ? 'movie' : 'file',
                note,
                tree: currentTree
            }


            if (isMovie)
            {
                let probe: ffmpeg.FfprobeFormat

                try   { probe  = await ffprobe(f_dest) }
                catch { return await rmAndRes(res, f_dest, 'Could not probe the file', 500) }

                const duration:   number = Math.round(probe.duration!),
                      thumb_path: string = path.join(user_uploads, 'thumbnails')

                thumb_name = `${new mongoose.Types.ObjectId().toString()}.png`

                await Promise.all([
                    Server.mkdir([thumb_path]),
                    makeThumbnail(f_dest, thumb_path, thumb_name, Math.floor(Math.random() * duration))
                ])

                thumb_file_loc = `${thumb_path}/${thumb_name}`

                itemObj = {
                    ...comObj,
                    sizeBytes: probe.size,
                    length: duration,
                    thumbnail: thumb_name,
                    created,
                    name: f_name.slice(0, f_name.lastIndexOf('.'))
                } as Omit<CollectionMovie, 'thumbnail'> 

                varObj = { movie: {
                    thumbnail: `${Server.getProtocolHost(req)}/files/${req.id}/thumbnails/${thumb_name}`, 
                    length: (itemObj as CollectionMovie).length
                }}
            }
            else
            {
                const filesize: number = (await fs.stat(f_dest)).size,
                      ext:      string = path.extname(file.originalname)
                
                itemObj = {
                    ...comObj,
                    sizeBytes: filesize,
                    filetype: getFiletype(ext),
                    created,
                    name: f_name
                } as CollectionFile

                varObj = { file: { filetype: getFiletype(ext) }}
            }

            const saveAt: string = findUpdateString(currentTree, user!.saved, 'locFolder')

            await Promise.all([
                User.updateOne(
                    { _id: req.id },
                    { $push: {
                        [saveAt]: itemObj
                    }}
                ),
                File.updateOne(
                    { ownerID: req.id },
                    { $push: {
                        items: {
                            _id: objectID,
                            secretName: file.filename,
                            thumbnail: thumb_name
                        }
                    }}
                )
            ])

            res.status(201).json({
                msg: 'Successfully uploaded',
                _id: objectID,
                name: itemObj.name,
                ...varObj
            })

        }
        catch
        {
            if (thumb_file_loc)
                await Server.rm([thumb_file_loc])

            return rmAndRes(res, f_dest, 'Could not insert the file', 500)
        }
    })
})

UserRoute.patch('/new-folder', JWTAuth, async (req: Request, res: Response) => {
    const {foldername, atFolder} = req.body

    if (Server.sanitizedString(foldername))
        return res.status(400).json({ msg: 'Invalid folder name' })

    if (!foldername || !atFolder)
        return res.status(400).json({ msg: 'Invalid body object' })

    try
    {
        const user = await User.findById(req.id)
                               .select('saved')
                               .lean()

        const target: i.Maybe<CollectionFolder> = findFolder(user!.saved[0], atFolder)

        if (!target)
            return res.status(400).json({ msg: 'Folder does not exist' })

        if (target.items.some(x => x.name === foldername))
            return res.status(400).json({ msg: 'Folder already exists' })

        const _id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId()
        const newFolder: CollectionFolder = {
            _id,
            items: [],
            itemtype: 'folder',
            name: foldername,
            tree: `${target.tree}/${foldername}`
        }

        const saveAt: string = findUpdateString(target.tree, user!.saved, 'locFolder')
        
        await User.updateOne(
            { _id: req.id },
            { $push: {
                [saveAt]: newFolder
            }}
        )

        res.status(201).json({ msg: 'Successfully created a new folder', id: _id })
    }
    catch
    {
        res.status(500).json({ msg: 'Could not create a directory' })
    }
})

UserRoute.delete('/delete-user', JWTAuth, async (req: Request, res: Response) => {
    try
    {
        await Promise.all([
            File.deleteOne({ ownerID: req.id }),
            User.deleteOne({ _id: req.id })
        ])
        
        await Server.rm([__dirname, '..', '..', 'uploads', req.id!], { recursive: true, throwErr: true })

        res.clearCookie('token')
        req.id = undefined

        res.status(200).json({ msg: 'Deleted account' })
    }
    catch
    {
        res.status(500).json({ msg: 'Could not delete the account' })
    }
})

UserRoute.delete('/delete-folder', JWTAuth, async (req: Request, res: Response) => {
    const { foldername, atFolder } = req.body

    if (!foldername || !atFolder)
        return res.status(400).json({ msg: 'Invalid body object' })
    
    if (atFolder === 'root')
        return res.status(400).json({ msg: 'Cannot remove root directory' })


    try
    {
        const user = await User.findById(req.id)
                               .select('saved')
                               .lean()

        const target: i.Maybe<CollectionFolder> = findFolder(user!.saved[0], atFolder),
              IDs:    mongoose.Types.ObjectId[] = []

        if (!target)
            return res.status(400).json({ msg: 'Folder does not exist' })


        loopFolders([target], (x: PossibleItem) => {
            if (x.itemtype === 'file' || x.itemtype === 'movie')
                IDs.push(x._id)
        })

        const files = (await File.aggregate([
            { $match: { ownerID: req.id }},
            {
                $project: {
                    secretName: 1,
                    ownerID: 1,

                    items: {
                        $filter: {
                            input: '$items',
                            as: 'item',
                            cond: { $in: ['$$item._id', IDs] }
                        }
                    }
                }
            }
        ]))[0].items as FileItems[]

        const userPath: string = path.join(__dirname, '..', '..', 'uploads', req.id!),
              delAt:    string = findUpdateString(target.tree, user!.saved, 'pullFolder') 


        for (const file of files)
        {
            await Server.rm([userPath, file.secretName])
            
            if (file.thumbnail)
                await Server.rm([userPath, 'thumbnails', file.thumbnail])
        }

        await Promise.all([
            User.updateOne(
                { _id: req.id },
                { $pull: {
                    [delAt]: { name: foldername }
                }}
            ),

            File.updateOne(
                { ownerID: req.id },
                { $pull: {
                    items: { _id: { $in: IDs } }           
                }}
            )
        ])
        
        res.status(200).json({ msg: 'Successfully deleted the folder' })
    }
    catch
    {
        res.status(500).json({ msg: 'Could not create a directory' })
    }
})


export default UserRoute