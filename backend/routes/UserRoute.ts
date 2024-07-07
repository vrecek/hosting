import express, {Router, Request, Response} from 'express'
import Server, { i } from '../Server'
import path from 'path'
import User from '../models/User'
import UserSchema, { CollectionFile, CollectionFolder, CollectionMovie, PossibleItem } from '../interfaces/UserSchema'
import jwt from 'jsonwebtoken'
import JWTAuth from '../middleware/JWTAuth'
import findFolder from '../utils/findFolder'
import findUpdateString from '../utils/findUpdateString'
import getFiletype, { AvailableFileTypes } from '../utils/getFiletype'
import ffprobe from '../utils/ffprobeFile'
import ffmpeg from 'fluent-ffmpeg'
import mongoose from 'mongoose'
import fsMkdir from '../utils/fsMkdir'
import makeThumbnail from '../utils/makeThumbnail'
import fs from 'fs'
import File from '../models/File'
import loopFolders from '../utils/loopFolders'
import { FileItems } from '../interfaces/FileSchema'


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

// delete file if error
UserRoute.post('/new-file', JWTAuth, async (req: Request, res: Response) => {
    const user_uploads: string = path.join(__dirname, '..', '..', 'uploads', `${req.id}`),
          file_id:      string = new mongoose.Types.ObjectId().toString()

    await fsMkdir(user_uploads)

    const fu  = new Server.FileUpload(AvailableFileTypes)
    const up  = fu.multerImageUpload(
        'disk', 
        Server.GiB, 
        'fileitem', 
        'single', 
        user_uploads,
        (file) => `${file_id}${path.extname(file.originalname)}`
    )

    up(req, res, async (err: any) => {
        const error = fu.multerImageUploadError(err, res, req)
        if (error) return error


        const {currentTree, filename, isMovie, movieDesc} = req.body,
              file: Express.Multer.File = req.file!

        if (!currentTree || !filename)
            return res.status(400).json({ msg: 'Invalid body object' })

        try
        {
            const user = await User.findOne({ _id: req.id })
                                   .select('saved')
                                   .lean()

            if (Server.sanitizedString(filename))
                return res.status(400).json({ msg: 'Invalid file name' })

            if (!findFolder(currentTree, user!.saved))
                return res.status(400).json({ msg: 'Folder does not exist' })


            const f_name: string = `${filename}${path.extname(file.originalname)}`,
                  f_dest: string = `${file.destination}/${file.filename}`

            let probe:      ffmpeg.FfprobeFormat,
                itemObj:    CollectionFile | Omit<CollectionMovie, 'thumbnail'>,
                thumb_name: i.Maybe<string> = undefined,
                varObj:     any = {}

            try { probe = await ffprobe(f_dest) }
            catch { return res.status(400).json({ msg: 'Could not probe the file' }) }


            const objectID: string = new mongoose.Types.ObjectId().toString()

            const comObj = {
                _id: objectID,
                itemtype: isMovie ? 'movie' : 'file',
                tree: currentTree,
                sizeBytes: probe.size
            }

            if (isMovie)
            {
                const duration:   number = Math.round(probe.duration!),
                      thumb_path: string = path.join(user_uploads, 'thumbnails')

                thumb_name = `${new mongoose.Types.ObjectId().toString()}.png`

                await Promise.all([
                    Server.mkdir([thumb_path]),
                    makeThumbnail(f_dest, thumb_path, thumb_name, Math.floor(Math.random() * duration))
                ])

                itemObj = {
                    ...comObj,
                    name: f_name.slice(0, f_name.lastIndexOf('.')),
                    description: movieDesc ?? '',
                    length: duration,
                    thumbnail: thumb_name
                } as Omit<CollectionMovie, 'thumbnail'> 

                varObj = { movie: {
                    description: movieDesc,
                    thumbnail: `${Server.getProtocolHost(req)}/files/${req.id}/thumbnails/${thumb_name}`, 
                    length: (itemObj as CollectionMovie).length
                }}
            }
            else
            {
                itemObj = {
                    ...comObj,
                    name: f_name,
                    filetype: getFiletype(file.mimetype)
                } as CollectionFile

                varObj = { file: { filetype: getFiletype(file.mimetype) }}
            }

            const saveAt: string = findUpdateString(currentTree, user!.saved, 'push')
                        
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
                _id: file_id,
                name: itemObj.name,
                ...varObj
            })

        }
        catch
        {
            res.status(500).json({ msg: 'Could not insert the file' })
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

        const target: i.Maybe<CollectionFolder> = findFolder(atFolder, user!.saved)

        if (!target)
            return res.status(400).json({ msg: 'Folder does not exist' })

        if (target.items.some(x => x.name === foldername))
            return res.status(400).json({ msg: 'Folder already exists' })

        const newFolder: Omit<CollectionFolder, '_id'> = {
            items: [],
            itemtype: 'folder',
            name: foldername,
            tree: `${target.tree}/${foldername}`
        }

        const saveAt: string = findUpdateString(target.tree, user!.saved, 'push')
        
        await User.updateOne(
            { _id: req.id },
            { $push: {
                [saveAt]: newFolder
            }}
        )

        res.status(201).json({ msg: 'Successfully created a new folder' })
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
        
        const userpath: string = path.join(__dirname, '..', '..', 'uploads', req.id!)
        fs.rmSync(userpath, { recursive: true })

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

        const target: i.Maybe<CollectionFolder> = findFolder(atFolder, user!.saved),
              IDs:    string[] = []

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
                            cond: { $in: ['$$item._id', IDs.map(x => new mongoose.Types.ObjectId(x))] }
                          }
                    }
                }
            }
        ]))[0].items as FileItems[]


        const userPath: string = path.join(__dirname, '..', '..', 'uploads', req.id!),
              delAt:    string = findUpdateString(target.tree, user!.saved, 'pull') 

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
    catch (e)
    {
        console.log(e)
        res.status(500).json({ msg: 'Could not create a directory' })
    }
})


export default UserRoute