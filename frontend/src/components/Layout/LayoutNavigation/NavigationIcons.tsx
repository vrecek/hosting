import Icon from "@/components/Common/Icon"
import { INavigationItem } from "@/interfaces/LayoutInterfaces"
import { FaFile } from "react-icons/fa"
import { Link } from "react-router-dom"


const NavigationIcons = () => {
    const icons: INavigationItem[] = [
        { url: '/', icon: <FaFile /> },
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