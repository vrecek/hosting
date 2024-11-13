import Icon from "@/components/Common/Icon"
import { IToggleItemContent } from "@/interfaces/ItemInterfaces"
import { FaEye, FaEyeSlash } from "react-icons/fa"


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