import { IInput } from "@/interfaces/CommonInterfaces"


const Input = ({ type, cname, label, changeFn, addEle }: IInput) => {
    return (
        <div className={`input-div ${cname}`}>

            <label>{label}</label>

            <div>

                <input 
                    type={type} 
                    spellCheck='false'
                    onChange={changeFn}
                />

                {addEle}

            </div>

        </div>
    )
}


export default Input