import { Maybe } from "./CommonInterfaces"
import UserType from "./UserInterfaces"


export interface INavigationItem
{
    url:  string
    icon: JSX.Element
}

export interface AppInit
{
    loaded: boolean
    user: Maybe<UserType>
}