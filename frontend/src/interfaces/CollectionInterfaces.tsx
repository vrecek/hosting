import { Maybe } from "./CommonInterfaces"
import { FileTypes, ICollectionFile, ICollectionFolder, PossibleItems } from "./UserInterfaces"


export interface LocationState
{ 
    folderTree: string
    pull?:      string
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

export interface IFilePopup extends IFolderPopup {}

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
    id:   string
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
    id:   string
}

export interface IB
{
    text:     string
    cname:    'blue' | 'red'
    trigger?: boolean
    clickFn?: (e: React.MouseEvent) => void
}

export interface IButtonDiv
{
    b1: IB
    b2: IB
}

export interface IUploadInput
{
    setSect: React.Dispatch<React.SetStateAction<Maybe<UploadSectionValue>>>
}

export interface IFileType
{
    value: string
    label: string
}

export interface UploadSectionValue
{
    filename: string
    filetype: string
    filesize: number
    movie?:   boolean
}

export interface FileAddData
{
    msg:  string
    _id:  string
    name: string

    file?: {
        filetype: FileTypes
    }

    movie?: {
        thumbnail:  string
        length:     number,
    }
}

export interface ICollectionMovieElement
{
    thumbnail: string
    length:    number
    size:      number
    _id:       string
    title:     string
}

export type ICollectionFileElement = Omit<ICollectionFile, 'note' | 'created'>