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
    itemtype: 'folder' | 'file' | 'movie'
    tree:      string
}

export type CollectionMovie = Omit<CollectionFile,'filetype'> & 
{
    thumbnail:   string
    length:      number
    description: string
}

export interface CollectionFile extends ItemType
{       
    filetype: 'picture' | 'video' | 'music' | 'txt' | 'code' | 'other'
    sizeKB:   number
    name:     string
    path:     string
}

export interface CollectionFolder extends ItemType
{
    items: PossibleItem[]
    name:   string
}

export type PossibleItem = CollectionFile|CollectionMovie|CollectionFolder

export interface PasswordObject
{
    salt: string
    iv:   string
    hash: string
}