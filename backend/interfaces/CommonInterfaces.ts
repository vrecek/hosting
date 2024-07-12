import { Response } from "express"


export type AsyncResponse = Promise<Response<any, Record<string, any>>>