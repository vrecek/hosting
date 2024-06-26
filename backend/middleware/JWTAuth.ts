import { NextFunction, Request, Response } from "express"
import jwt from 'jsonwebtoken'
import { JWTResponse } from "../interfaces/JWTInterfaces"
import User from "../models/User"


const JWTAuth = async (req: Request, res: Response, next: NextFunction) => {
    const token: string | undefined = req.signedCookies?.token
    
    try
    {
        if (!token) throw 1

        const auth: JWTResponse = jwt.verify(token, process.env.JWTKEY!) as JWTResponse
        if (!auth) throw 1

        const user = await User.exists({ _id: auth.id })
        if (!user) throw 1

        req.id = auth.id
        next()
    }
    catch(e)
    {
        req.id = undefined
        return res.status(401).json({ msg: 'User not authenticated' })
    }
}


export default JWTAuth