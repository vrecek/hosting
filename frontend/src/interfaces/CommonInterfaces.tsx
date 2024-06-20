import { Aliases } from "@/utils/Client"


export interface IIcon
{
    icon:     JSX.Element
    cname?:   string
    clickFn?: (e: React.MouseEvent) => void
}

export interface IImage
{
    source:  string
    cname?:  string
    altTxt?: string
}

export interface IInput
{
    type:      'text' | 'password'
    label:     string
    cname?:    string
    addEle?:   JSX.Element
    changeFn?: (e: React.ChangeEvent) => void
}

export interface IButton
{
    children:     any
    cname?:       string
    triggerForm?: boolean
    clickFn?:     (e: React.MouseEvent) => void
}

export type Set<T> = React.Dispatch<React.SetStateAction<T>>

export type Maybe<T> = Aliases.Maybe<T>