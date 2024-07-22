import Icon from "../Common/Icon"
import { IPopupTitle } from "@/interfaces/CollectionInterfaces"


const PopupTitle = ({ text, icon }: IPopupTitle) => {
    return (
        <section className="popup-title">

            <Icon icon={icon} />

            <p>{ text }</p>

        </section>
    )
}


export default PopupTitle