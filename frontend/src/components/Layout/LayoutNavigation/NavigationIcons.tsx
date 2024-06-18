import Icon from "@/components/Common/Icon"
import { INavigationItem } from "@/interfaces/LayoutInterfaces"
import { MdOutlineCollectionsBookmark } from "react-icons/md";
import { Link } from "react-router-dom"
import { IoHomeSharp } from "react-icons/io5"
import { MdAccountBox } from "react-icons/md"
import { UserContext } from "@/App";
import React from "react";
import { Maybe } from "@/interfaces/CommonInterfaces";
import UserType from "@/interfaces/UserInterfaces";


const NavigationIcons = () => {
    const UserC: Maybe<UserType> = React.useContext(UserContext)
    const icons: INavigationItem[] = [
        { url: '/', icon: <IoHomeSharp /> },
        { url: UserC ? '/account' : '/account/signin', icon: <MdAccountBox /> },
    ]

    if (UserC)
        icons.splice(1, 0, { url: '/collection', icon: <MdOutlineCollectionsBookmark /> })


    return (
        <ul>

            {
                icons.map((x, i) => (
                    <li key={i}>
                        <Link to={x.url}>
                            <Icon icon={x.icon} />
                        </Link>
                    </li>
                ))
            }

        </ul>
    )
}


export default NavigationIcons