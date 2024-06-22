import express, {Router, Request, Response} from 'express'
import Server, { i } from '../Server'
import User from '../models/User'
import UserSchema, { CollectionFolder } from '../interfaces/UserSchema'
import jwt from 'jsonwebtoken'
import JWTAuth from '../jwt/JWTAuth'
import findFolder from '../utils/findFolder'
import findUpdateString from '../utils/findUpdateString'


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