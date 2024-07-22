import express, { Request, Response, Router } from 'express'
import JWTAuth from '../middleware/JWTAuth'
import File from '../models/File'
import User from '../models/User'
import findItem from '../utils/findItem'
import { ItemType } from '../interfaces/UserSchema'
import Server, { i } from '../Server'
import path from 'path'
import fs from 'fs/promises'
import { FileItems } from '../interfaces/FileSchema'
import StaticAuth from '../middleware/StaticAuth'
import findUpdateString from '../utils/findUpdateString'
import mongoose from 'mongoose'
import { queryFileItemById } from '../utils/queryUtils'


const ItemRoute: Router = express.Router()


ItemRoute.get('/:itemId', JWTAuth, async (req: Request, res: Response) => {
    const { itemId } = req.params

    try
    {
        const [user, file] = await Promise.all([
            User.findOne({ _id: req.id })
                .select('saved')
                .lean(),

            File.findOne(...queryFileItemById(req.id!, itemId)).lean()
        ])

        const searchedFile = findItem(user!.saved[0], (x: ItemType) => {
            return x.itemtype !== 'folder' && 
                   x._id.toString() === itemId
        })                          

        if (!searchedFile || !file)
            return res.status(404).json({ msg: 'File not found' })

        const filepath: string = path.join(__dirname, '..', '..', 'uploads', req.id!, file.items[0].secretName)

        try   { await fs.access(filepath) }
        catch { return res.status(404).json({ msg: 'File does not exist' }) }

        const fileLoc: string = `${Server.getProtocolHost(req)}/files/${req.id}/${file.items[0].secretName}`
        
        if (searchedFile.itemtype === 'file')
        {
            return res.json({
                ...searchedFile,
                itemURL: fileLoc
            })
        }

        return res.json({
            msg: true
        })
    }
    catch
    {
        res.status(500).json({ msg: 'Could not get the item' })
    }
})

ItemRoute.get('/download/:itemId/:outname?', JWTAuth, StaticAuth, async (req: Request, res: Response) => {
    const {itemId, outname} = req.params

    try 
    {
        const file: i.Maybe<FileItems> = (
            await File.findOne(...queryFileItemById(req.id!, itemId))
                      .lean()
        )?.items?.[0]

        if (!file)
            return res.status(404).json({ msg: 'File not found' })
        
        const filepath: string = path.join(__dirname, '..', '..', 'uploads', req.id!, file.secretName)
        res.download(filepath, outname ?? file.secretName)
    } 
    catch
    {
        return res.status(500).json({ msg: 'Could not download the file' })
    }
})

ItemRoute.delete('/delete/:itemId', JWTAuth, async (req: Request, res: Response) => {
    const {itemId} = req.params

    try
    {
        const [user, file] = await Promise.all([
            User.findOne({ _id: req.id })
                .select('saved')
                .lean(),

            File.findOne(...queryFileItemById(req.id!, itemId)).lean()
        ])

        const item = findItem(user!.saved[0], (x: ItemType) => {
            return x.itemtype !== 'folder' && x._id.toString() === itemId
        })


        if (!file || !item)
            return res.status(404).json({ msg: 'File does not exist' })


        const delPath: string = findUpdateString(item.tree, user!.saved, 'locFolder'),
              mongoID: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(itemId)

        await Promise.all([
            File.updateOne(
                { ownerID: req.id },
                { $pull: {
                    items: { _id: itemId }
                }}
            ),

            User.updateOne(
                { _id: req.id },
                { $pull: {
                    [delPath]: { _id: mongoID }
                }}
            ),

            Server.rm([__dirname, '..', '..', 'uploads', req.id!, `${file.items[0].secretName}*`], { fileRx: true })
        ])

        res.json({ msg: 'Successfully deleted' })
    }
    catch
    {
        res.status(500).json({ msg: 'Could not delete the file' })
    }
})


export default ItemRoute