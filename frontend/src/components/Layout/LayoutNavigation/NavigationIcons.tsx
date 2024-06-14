import Icon from "@/components/Common/Icon"
import { INavigationItem } from "@/interfaces/LayoutInterfaces"
import { MdOutlineCollectionsBookmark } from "react-icons/md";
import { Link } from "react-router-dom"
import { IoHomeSharp } from "react-icons/io5"
import { MdAccountBox } from "react-icons/md"


const NavigationIcons = () => {
    const icons: INavigationItem[] = [
        { url: '/', icon: <IoHomeSharp /> },
        { url: '/collection', icon: <MdOutlineCollectionsBookmark /> },
        { url: '/account/signin', icon: <MdAccountBox /> },
    ]


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