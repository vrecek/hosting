export default interface UserType
{
    _id:      string
    username: string
    mail:     string
    saved:    ICollectionFolder[]
}


export interface ItemType
{
    itemtype: 'folder' | 'file' | 'movie'
}

export type ICollectionMovie = Omit<ICollectionFile,'filetype'> & 
{
    thumbnail:   string
    length:      number
    description: string
}

export interface ICollectionFile extends ItemType
{       
    filetype: 'picture' | 'video' | 'music' | 'txt' | 'code' | 'other'
    sizeKB:   number
    name:     string
    path:     string
}

export interface ICollectionFolder extends ItemType
{
    items: (ICollectionFile|ICollectionMovie|ICollectionFolder)[]
    name:  string
}