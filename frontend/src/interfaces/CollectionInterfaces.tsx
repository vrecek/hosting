import { Maybe } from "./CommonInterfaces"
import { ICollectionFolder, PossibleItems } from "./UserInterfaces"


export interface LocationState
{ 
    folderTree: string
}

export interface LocationFnObj
{
    arg1: any
    call: string
}

export type LocationItemsFn = (items: PossibleItems[]) => void

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
    setMenu: React.Dispatch<React.SetStateAction<JSX.Element | null>>
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

export interface IManageOptions extends CurrentFolder
{
    name: string
}

export interface IManageItems extends CurrentFolder
{
    setMenu: React.Dispatch<React.SetStateAction<JSX.Element | null>>
}

export interface ICollectionContext
{
    setItems: React.Dispatch<React.SetStateAction<Maybe<ItemsObject>>>
}

export interface IManageDelete extends IManageItems
{
    name: string
}