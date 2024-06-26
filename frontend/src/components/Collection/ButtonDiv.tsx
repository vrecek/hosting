import { IButtonDiv } from "@/interfaces/CollectionInterfaces"
import Button from "../Common/Button"


const ButtonDiv = ({ b1, b2 }: IButtonDiv) => {
    return (
        <div className="btns">

            <Button triggerForm={b1.trigger} clickFn={b1.clickFn} cname={b1.cname}>
                {b1.text}
            </Button>

            <Button triggerForm={b2.trigger} clickFn={b2.clickFn} cname={b2.cname}>
                {b2.text}
            </Button>

        </div>
    )
}


export default ButtonDiv