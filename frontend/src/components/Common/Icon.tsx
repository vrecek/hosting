import { IIcon } from "@/interfaces/CommonInterfaces"


const Icon = ({icon, clickFn, cname}: IIcon) => {
    return (
        <span onClick={clickFn} className={cname}>

            {icon}

        </span>
    )
}


export default Icon