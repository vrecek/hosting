import Icon from "@/components/Common/Icon"
import { IIcon } from "@/interfaces/CommonInterfaces"


const MovieIconOption = ({ icon, clickFn, cname }: IIcon) => {
    return (
        <Icon 
            icon={icon}
            clickFn={clickFn}
            cname={cname}
        />
    )
}


export default MovieIconOption