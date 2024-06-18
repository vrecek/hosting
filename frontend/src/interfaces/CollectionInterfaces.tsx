import { ICollectionFolder } from "./UserInterfaces"


export interface LocationState
{ 
    folderName: string
}

export interface ItemsObject extends ICollectionFolder
{
    prevFolders: string[]
}

export interface ICollectionHeader
{
    prevFolders: string[]
    current:     string
}