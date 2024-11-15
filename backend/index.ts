import express, { Express } from 'express'
import * as dotenv from 'dotenv'
import path from 'path'
import mongoose from 'mongoose'
import UserRoute from './routes/UserRoute'
import cookieParser from 'cookie-parser'
import JWTAuth from './middleware/JWTAuth'
import StaticAuth from './middleware/StaticAuth'
import ffmpegPath from 'ffmpeg-static'
import ffmpeg from 'fluent-ffmpeg'
import ItemRoute from './routes/ItemRoute'



ffmpeg.setFfmpegPath(ffmpegPath!)
dotenv.config({ path: path.join(__dirname, '../', '.env') });

(async () => {
    console.log('Connecting...')

    const PORT:   string  = process.env.PORT!,
          MONGO:  string  = process.env.MONGO!,
          server: Express = express()

          
    server.use(express.json())
    server.use(express.urlencoded({ extended: false }))
    server.use(cookieParser(process.env.COOKIEKEY))

    server.use('/files', JWTAuth, StaticAuth, express.static(path.join(__dirname, '..', 'uploads')))

    server.use('/filenode/api/user', UserRoute)
    server.use('/filenode/api/item', ItemRoute)
    
    try
    {
        await mongoose.connect(MONGO, { serverSelectionTimeoutMS: 10000 })
        server.listen(PORT, () => console.log(`Server started at port ${PORT}`))
    }
    catch (err: any)
    {
        console.log(`Could not start the server. Reason: ${err.toString()}`)
    }

})()