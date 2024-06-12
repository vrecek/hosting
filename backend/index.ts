import express, { Express } from 'express'
import * as dotenv from 'dotenv'
import path from 'path'
import mongoose from 'mongoose'


dotenv.config({ path: path.join(__dirname, '../', '.env') })


;(async () => {

    const PORT:   string  = process.env.PORT ?? '5000',
          MONGO:  string  = process.env.MONGO ?? '',
          server: Express = express()


    server.use(express.json())
    server.use(express.urlencoded({ extended: false }))

    await mongoose.connect(MONGO)
    server.listen(PORT, () => console.log(`Server started at port ${PORT}`))

})()