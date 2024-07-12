import { IToggleItemContent } from "@/interfaces/ItemInterfaces"
import { FaEye, FaEyeSlash } from "react-icons/fa"
import Icon from "../Common/Icon"


const ToggleItemContent = ({ toggled, setToggle }: IToggleItemContent) => {
    return (
        <section className="toggle-item-content">

            <p>{toggled ? 'Hide' : 'Show'} content</p>

            <Icon
                icon={ toggled ? <FaEye /> : <FaEyeSlash />}
                clickFn={() => setToggle(curr => !curr)}
            />

        </section>
    )
}

export default ToggleItemContent