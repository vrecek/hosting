import { Aliases } from "@/utils/Client"
import React from "react"


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
    type:      'text' | 'password' | 'checkbox'
    label:     string
    cname?:    string
    defVal?:   string
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

export interface IIconButton
{
    cname:   string
    icon:    JSX.Element
    clickFn: (e: React.MouseEvent) => void
}