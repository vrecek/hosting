import { ICollectionFolder } from "./UserInterfaces"


export interface LocationState
{ 
    folderTree: string
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

export interface IFolderPopup extends CurrentFolder
{
    setMenu: React.Dispatch<React.SetStateAction<boolean>>
}

export interface CurrentFolder
{
    currentTree: string
}

export interface FolderElement
{
    folder_name: string
    items_len:   number
    folder_tree: string
}