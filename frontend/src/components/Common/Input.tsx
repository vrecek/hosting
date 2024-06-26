import { IInput } from "@/interfaces/CommonInterfaces"
import Client from "@/utils/Client"


const Input = ({ type, cname, label, changeFn, addEle, defVal }: IInput) => {
    const ID: string = Client.getRandomID()

    return (
        <div className={`input-div ${cname}`}>

            <label htmlFor={ID}>{label}</label>
            
            <div>

                <input
                    id={ID} 
                    type={type} 
                    defaultValue={defVal}
                    defaultChecked={false}
                    key={defVal}
                    spellCheck='false'
                    onChange={changeFn}
                />

                {addEle}

            </div>

        </div>
    )
}


export default Input