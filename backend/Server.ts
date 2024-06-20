import crypto from 'crypto'
import { Request } from 'express'


namespace i {
    export type Maybe<T> = T | null | undefined
}


class Server
{

    //|***********|//
    //| CONSTANTS |//
    //|***********|//

    public static readonly MB:    number = 1024 * 1024

    public static readonly HOUR:  number = 1000 * 60 * 60
    public static readonly DAY:   number = this.HOUR * 24
    public static readonly WEEK:  number = this.DAY * 7
    public static readonly MONTH: number = this.DAY * 30


    public constructor()
    {

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
    //| OTHER |//
    //|*******|//

    public static async sleep(ms: number): Promise<null>
    {
        return new Promise(res => setTimeout(res, ms))
    }

    public static getIP(req: Request): string | null
    {
        return req.headers['x-forwarded-for']?.[0] || req.socket.remoteAddress || null
    }
}


export interface EncryptObject
{
    salt: string
    iv:   string
    hash: string
}

export interface Validation
{
    success: boolean
    error:   string | null
}


export {
    i
}


export default Server