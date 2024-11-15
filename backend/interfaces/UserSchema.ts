import mongoose from "mongoose"

export default interface UserSchema
{
    _id:      string
    username: string
    mail:     string
    password: PasswordObject
    saved:    CollectionFolder[]
}


export interface ItemType
{
    _id:      mongoose.Types.ObjectId
    itemtype: ItemTypes
    tree:     string
    name:     string
}

export interface CollectionMovie extends Omit<CollectionFile, 'filetype'>
{
    length:      number
    thumbnail:   string
}

export interface CollectionFile extends ItemType
{       
    filetype:  FileTypes
    sizeBytes: number
    note:      string
    created:   number
}

export interface CollectionFolder extends ItemType
{
    items: PossibleItem[]
}

export type FileTypes = 'picture' | 'video' | 'audio' | 'txt' | 'code' | 'other'
export type ItemTypes = 'folder' | 'file' | 'movie'

export type PossibleItem = CollectionFile|CollectionMovie|CollectionFolder

export interface PasswordObject
{
    salt: string
    iv:   string
    hash: string
}