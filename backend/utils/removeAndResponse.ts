import { Response } from "express"
import Server from "../Server"
import { AsyncResponse } from "../interfaces/CommonInterfaces"


const rmAndRes = async (res: Response, rmdest: string, msg: string, code?: number): AsyncResponse => {
    await Server.rm([rmdest])

    return res.status(code ?? 400).json({ msg })
}


export default rmAndRes