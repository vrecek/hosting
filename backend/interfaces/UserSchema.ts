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
    itemtype: ItemTypes
    tree:     string
    name:     string
}

export interface CollectionMovie extends Omit<CollectionFile, 'filetype'>
{
    thumbnail:   string
    length:      number
    description: string
}

export interface CollectionFile extends ItemType
{       
    filetype:  FileTypes
    sizeBytes: number
    filepath:  string
    rand_name: string
}

export interface CollectionFolder extends ItemType
{
    items: PossibleItem[]
}

export type FileTypes = 'picture' | 'video' | 'music' | 'txt' | 'code' | 'other'
export type ItemTypes = 'folder' | 'file' | 'movie'

export type PossibleItem = CollectionFile|CollectionMovie|CollectionFolder

export interface PasswordObject
{
    salt: string
    iv:   string
    hash: string
}