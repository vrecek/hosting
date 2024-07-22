export default interface UserType
{
    _id:      string
    username: string
    mail:     string
    saved:    ICollectionFolder[]
}


export interface ItemType
{
    itemtype: ItemTypes
    tree:     string
    _id:      string
    name:     string
}

export interface ICollectionMovie extends Omit<ICollectionFile, 'filetype'>
{
    thumbnail:   string
    length:      number
}

export interface ICollectionFile extends ItemType
{       
    filetype:  FileTypes
    sizeBytes: number
    note:      string
    created:   number
}

export interface ICollectionFolder extends Omit<ItemType, '_id'>
{
    _id?:  string
    items: PossibleItems[]
}

export type FileTypes = 'picture' | 'video' | 'audio' | 'txt' | 'code' | 'other'
export type ItemTypes = 'folder' | 'file' | 'movie'

export type PossibleItems = (ICollectionFile|ICollectionMovie|ICollectionFolder)