import { IKeyValue } from "@/interfaces/ItemInterfaces"
import Icon from "../Common/Icon"


const KeyValue = ({ name, value, cname, icon }: IKeyValue) => {
    return (
        <div className={cname}>

            <p className="name">
                { icon && <Icon icon={icon} />} {name}: 
            </p>
            
            <p className="value">{value}</p>

        </div>
    )
}


export default KeyValue