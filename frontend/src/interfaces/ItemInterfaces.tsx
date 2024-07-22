import { FileTypes, ICollectionFile, ICollectionMovie } from "./UserInterfaces"

export interface ItemLocation
{
    id:   string
    tree: string
}

export interface IKeyValue
{
    name:   string
    value:  string
    cname?: string
    icon?:  JSX.Element
}

export type FetchItem = (ICollectionFile | ICollectionMovie) &
{
    itemURL: string
}

export interface IItemButtons
{
    id:         string
    outputname: string
}

export interface IFileArticle extends ICollectionFile
{
}

export interface IToggleItemContent
{
    toggled:   boolean
    setToggle: React.Dispatch<React.SetStateAction<boolean>>
}

export interface IItemContent
{
    itemURL:  string
    filetype: FileTypes
}