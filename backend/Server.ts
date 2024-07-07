import crypto from 'crypto'
import multer, { FileFilterCallback } from 'multer'
import fs from 'fs/promises'
import path from 'path'
import { Request, Response as EResponse } from 'express'



class Server
{
    //|***********|//
    //| CONSTANTS |//
    //|***********|//

    public static readonly MiB:   number = 2 ** 20
    public static readonly GiB:   number = 2 ** 30

    public static readonly HOUR:  number = 1000 * 60 * 60
    public static readonly DAY:   number = this.HOUR * 24
    public static readonly WEEK:  number = this.DAY * 7
    public static readonly MONTH: number = this.DAY * 30


    public constructor()
    {}

    //|*************|//
    //| FILE UPLOAD |//
    //|*************|//

    public static FileUpload = class
    {
        private allowedExts:    string[]
        private multerFileSize: number
        private multerMethod:   i.Maybe<MulterUploadType>


        public constructor(allowedExts: string[])
        {
            this.allowedExts    = allowedExts
            this.multerFileSize = 0
            this.multerMethod   = null
        }


        private returnMulterStorage(type: MulterSaveType, uploadPath?: string, filenameFn?: FileNameFnArgument): multer.StorageEngine
        {
            if (type === 'memory') 
                return multer.memoryStorage()
    
            if (type === 'disk' && uploadPath)
            {
                const storage: multer.StorageEngine = multer.diskStorage({
                    destination: (req: Request, file: Express.Multer.File, cb: DestinationCallback) => {
                        cb(null, uploadPath)
                    },
    
                    filename: (req: Request, file: Express.Multer.File, cb: FileNameCallback) => {
                        cb(null, filenameFn?.(file) ?? Server.getDateWithName(file.originalname))
                    }
                })
    
                return storage
            }
    
            throw new Error('Got *disk* save type, but the *uploadPath* was not specified')
        }

        /**
            * @param type Either 'disk' or 'memory' 
            * @param maxSizeKb maximum file size
            * @param fieldString FormData fieldname where the image/s is/are appended
            * @param uploadMethod Either 'array' or 'single'
            * @param uploadPath Path from where class JavaScript file is located, NOT where the method is executed. Optional if type === 'memory'
            * @info Make sure to include files to FormData or stop submitting function if they arent present (Client side form), or an error will be thrown
            * @info Make sure to create uploadPath directory if you want to use it
            * @returns Function that has Request, Response and callback with an error argument. Wrap your whole code in that callback to make it work
        */
        public multerImageUpload(type: MulterSaveType, maxSizeKb: number, fieldString: string, uploadMethod: MulterUploadType, uploadPath?: string, filenameFn?: FileNameFnArgument)
        {
            const storage: multer.StorageEngine = this.returnMulterStorage(type, uploadPath, filenameFn)

            const fileFilter = (req: Request, file: Express.Multer.File, callback: FileFilterCallback): void => {
                if (this.allowedExts.some(x => x === file.mimetype))
                    return callback(null, true)

                const error: Error = new Error()
                Object.assign(error, { code: 'WRONG_MIMETYPE' })
                
                callback(error)
            }

            const upload: multer.Multer = multer({
                storage,
                limits: {
                    fileSize: maxSizeKb
                },
                fileFilter
            })

            this.multerFileSize = maxSizeKb
            this.multerMethod   = uploadMethod

            if (uploadMethod === 'single')
                return upload.single(fieldString)

            else if (uploadMethod === 'array')
                return upload.array(fieldString)


            throw new Error('Incorrect upload method')
        }

        /**
            * @param err error from the multerImageUpload() callback argument
            * @returns Response with { msg } if error, null otherwise. Throw if present
        */
        public multerImageUploadError(err: any, res: EResponse, req: Request): i.Maybe<ExpressResponse>
        {
            if (err)
            {
                switch (err.code)
                {
                    case 'WRONG_MIMETYPE':
                        return res.status(400).json({ msg: 'Incorrect file mimetype' })

                    case 'LIMIT_FILE_SIZE':
                        const msg: string = `File's too large. Maximum size: ${Math.floor(this.multerFileSize / Server.MiB)}mb`
                        return res.status(400).json({msg})

                    default: 
                        return res.status(500).json({ msg: 'Unkown error' })
                }
            }

            if ((this.multerMethod === 'single' && !req.file) ||
                (this.multerMethod === 'array' && !req.files?.length))
            {
                return res.status(400).json({ msg: 'Image field is empty' })
            }

            return null
        }
    }


    //|************|//
    //| VALIDATION |//
    //|************|//

    public static validateUsername(username: string, min: number, max: number, errArr?: string[]): Validation
    {
        let error: string | null = null

        if (!username)
            error = 'Username must be provided'
        else if (username.length < min || username.length > max)
            error = `Username must have ${min}-${max} characters`
        else if (!/^[a-z0-9]+$/i.test(username))
            error = 'Username must be alphanumeric'

        errArr && error && errArr.push(error)
        return { success: !error, error }
    }

    public static validatePassword(min: number, password: string, confirm: string, errArr?: string[]): Validation
    {
        let error: string | null = null

        if (password.length < min)
            error = `Password must have minimum ${min} characters`        
        if (password !== confirm)
            error = `Passwords are different`        

        errArr && error && errArr.push(error)
        return { success: !error, error }
    }

    public static validateMail(mail: string, errArr?: string[]): Validation
    {
        let error: string | null = null

        if (!mail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/i.test(mail))
            error = 'Mail address is invalid'

        errArr && error && errArr.push(error)
        return { success: !error, error }
    }

    public static async validateCaptcha(captcha: string, key: string, errArr?: string[]): Promise<Validation>
    {
        let error: string | null = null

        const res: Response = await fetch(
            `https://www.google.com/recaptcha/api/siteverify?secret=${key}&response=${captcha ?? 'x'}`, 
            { method: 'POST' }
        )
        const json: any = await res.json()

        if (!json?.success)
            error = 'Please solve captcha'

        errArr && error && errArr.push(error)
        return { success: !error, error }
    }

    //|************|//
    //| SANITIZING |//
    //|************|//

    public static sanitizedString(str: string, illegal?: string[]): boolean
    public static sanitizedString(str: string, illegal?: string[], replaceChar?: string): string

    public static sanitizedString(str: string, illegal?: string[], replaceChar?: string): string | boolean
    {
        const illegalChars: string[] = illegal ?? ['.', ',', '<', '>', ';', ':']
        
        if (!replaceChar)
            return str ? illegalChars.some(x => str.includes(x)) : true

        const rx: RegExp = new RegExp(`[${illegalChars.join('')}]`, 'g')
        return str.replaceAll(rx, replaceChar)
    }

    //|*********|//
    //| HASHING |//
    //|*********|//

    public static hash(key32bytesHex: string, text: string): EncryptObject
    {
        const salt: Buffer = crypto.randomBytes(16),
              iv:   Buffer = crypto.randomBytes(16)

        const cipher: crypto.Cipher = crypto.createCipheriv(
            'aes-256-cbc',
            crypto.pbkdf2Sync(
                Buffer.from(key32bytesHex, 'hex'), 
                salt, 
                10000, 32, 
                'sha256'
            ),
            iv
        )
        
        return {
            salt: salt.toString('hex'),
            iv: iv.toString('hex'),
            hash: cipher.update(text, 'utf-8', 'hex') + cipher.final('hex')
        }
    }


    public static verifyHash(key32bytesHex: string, encryptObj: EncryptObject, text: string): boolean
    {
        const decipher: crypto.Decipher = crypto.createDecipheriv(
            'aes-256-cbc',
            crypto.pbkdf2Sync(
                Buffer.from(key32bytesHex, 'hex'),
                Buffer.from(encryptObj.salt, 'hex'),
                10000, 32,
                'sha256'
            ),
            Buffer.from(encryptObj.iv, 'hex')
        )

        return text === decipher.update(encryptObj.hash, 'hex', 'utf-8') + decipher.final('utf-8')
    }

    //|*******|//
    //| FILES |//
    //|*******|//

    public static async mkdir(pathsToJoin: string[]): Promise<void>
    {
        const pathname: string = path.join(...pathsToJoin)

        try { await fs.access(path.join(pathname)) }
        catch { await fs.mkdir(path.join(pathname)) }
    }

    // recursive
    public static async rm(paths: string[], throwErr?: boolean): Promise<void>
    {
        try 
        { 
            await fs.unlink(path.join(...paths))
        }
        catch (e: any)
        {
            if (throwErr)
                throw new Error(e)

            console.log(`Could not delete file: ${paths.join('/')}\nMessage: ${e}`) 
        }
    }

    //|*******|//
    //| OTHER |//
    //|*******|//

    public static async sleep(ms: number): Promise<null>
    {
        return new Promise(res => setTimeout(res, ms))
    }

    public static getRandomID(): string 
    {
        return Math.random().toString(16).slice(2)
    }

    public static getDateWithName(name: string): string
    {
        const da: Date = new Date(Date.now())

        const date: string = `${da.getFullYear()}-${da.getMonth() + 1}-${da.getDate()}`,
              time: string = `${da.getHours()}-${da.getMinutes()}-${da.getSeconds()}`

        return `${date}_${time}-${name}`
    }

    public static getIP(req: Request): string | null
    {
        return req.headers['x-forwarded-for']?.[0] || req.socket.remoteAddress || null
    }

    public static getProtocolHost(req: Request): string
    {
        return `${req.protocol}://${req.get('Host')}` 
    }
}


/********************
####### TYPES #######
********************/

namespace i
{
    export type Maybe<T> = T | null | undefined
}

//|************|//
//| VALIDATION |//
//|************|//
interface EncryptObject
{
    salt: string
    iv:   string
    hash: string
}

interface Validation
{
    success: boolean
    error:   string | null
}

//|********|//
//| MULTER |//
//|********|//
type MulterUploadType = 'single' | 'array'
type MulterSaveType   = 'disk' | 'memory'

type DestinationCallback = (error: Error | null, destination: string) => void
type FileNameCallback    = (error: Error | null, filename: string) => void
type FileNameFnArgument  = (file: Express.Multer.File) => string


//|*********|//
//| EXPRESS |//
//|*********|//
type ExpressResponse = EResponse<any, Record<string, any>>

// interface MulterDiskFileType {
//     fieldname: string,
//     originalname: string,
//     encoding: string,
//     mimetype: string,   
//     destination: string,
//     filename: string,
//     path: string,
//     size: number
// }


export {
    i,
    EncryptObject,
    Validation
}

export default Server