import express, {Router, Request, Response} from 'express'
import Server, { i } from '../Server'
import path from 'path'
import User from '../models/User'
import UserSchema, { CollectionFile, CollectionFolder, CollectionMovie } from '../interfaces/UserSchema'
import jwt from 'jsonwebtoken'
import JWTAuth from '../middleware/JWTAuth'
import findFolder from '../utils/findFolder'
import findUpdateString from '../utils/findUpdateString'
import getFiletype, { AvailableFileTypes } from '../utils/getFiletype'
import ffprobe from '../utils/ffprobeFile'
import ffmpeg from 'fluent-ffmpeg'
import fs from 'fs/promises'
import mongoose from 'mongoose'
import fsMkdir from '../utils/fsMkdir'
import makeThumbnail from '../utils/makeThumbnail'


const UserRoute: Router = express.Router()


UserRoute.get('/auth', JWTAuth, async (req: Request, res: Response) => {
    try
    {
        const user = await User.findById(req.id)
                               .select('-password')
                               .lean()

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
    
    
        const newUser = new User({
            username,
            mail,
            password: Server.hash(process.env.HASHKEY!, password)
        })
    
        await newUser.save()

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
    }
    catch
    {
        return res.status(500).json({ msg: 'Could not log in'})
    }

    res.status(200).json({ msg: "Successfully logged in "})
})

UserRoute.post('/logout', JWTAuth, (req: Request, res: Response) => {
    res.clearCookie('token')
    req.id = undefined

    res.status(200).json({ msg: 'Logged out' })
})

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

        const f_name: string = `${filename}${path.extname(file.originalname)}`,
              f_dest: string = `${file.destination}/${file.filename}`

        let probe:   ffmpeg.FfprobeFormat,
            itemObj: CollectionFile | CollectionMovie,
            varObj = {}
            
        try { probe = await ffprobe(f_dest) }
        catch { return res.status(400).json({ msg: 'Could not probe the file' }) }

        const comObj = {
            filepath: f_dest,
            itemtype: isMovie ? 'movie' : 'file',
            rand_name: file.filename,
            tree: currentTree,
            sizeBytes: probe.size
        }

        if (isMovie)
        {
            const duration:   number = Math.round(probe.duration!),
                  thumb_path: string = path.join(user_uploads, 'thumbnails'),
                  thumb_name: string = `${new mongoose.Types.ObjectId().toString()}.png`

            await fsMkdir(thumb_path)
            await makeThumbnail(f_dest, thumb_path, thumb_name, Math.floor(Math.random() * duration))

            itemObj = {
                ...comObj,
                name: f_name.slice(0, f_name.lastIndexOf('.')),
                description: movieDesc,
                length: duration,
                thumbnail: `${thumb_path}/${thumb_name}`
            } as CollectionMovie   
            
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

        console.log(itemObj)
        res.json({
            msg: 'Successfully uploaded',
            _id: file_id,
            name: itemObj.name,
            ...varObj
        })
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

        const newFolder: CollectionFolder = {
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
        await User.deleteOne({ _id: req.id })

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

        const target: i.Maybe<CollectionFolder> = findFolder(atFolder, user!.saved)

        if (!target)
            return res.status(400).json({ msg: 'Folder does not exist' })


        let delAt: string = findUpdateString(target.tree, user!.saved, 'pull')
        await User.updateOne(
            { _id: req.id },
            { $pull: {
                [delAt]: {name: foldername}
            }}
        )

        res.status(201).json({ msg: 'Successfully deleted the folder' })
    }
    catch
    {
        res.status(500).json({ msg: 'Could not create a directory' })
    }
})


export default UserRoute