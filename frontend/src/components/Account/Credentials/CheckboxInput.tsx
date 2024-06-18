import { ICheckboxInput } from "@/interfaces/AccountInterfaces"


const CheckboxInput = ({ id, label, cname }: ICheckboxInput) => {
    return (
        <div className={`checkbox-input ${cname}`}>

            <input id={id} type='checkbox' />
            <label htmlFor={id}>{label}</label>

        </div>
    )
}


export default CheckboxInput