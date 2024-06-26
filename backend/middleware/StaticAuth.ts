import { NextFunction, Request, Response } from "express"


const StaticAuth = async (req: Request, res: Response, next: NextFunction) => {
    console.log('stat aut')
    next()
}


export default StaticAuth