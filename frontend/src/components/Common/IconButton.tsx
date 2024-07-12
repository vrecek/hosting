import { IIconButton } from "@/interfaces/CommonInterfaces"
import Icon from "./Icon"


const IconButton = ({cname, icon, clickFn}: IIconButton) => {
    return (
        <div onClick={clickFn} className={`icon-button-div ${cname}`}>

            <Icon icon={icon} />

        </div>
    )
}


export default IconButton