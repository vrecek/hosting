import { IButton } from "@/interfaces/CommonInterfaces"


const Button = ({children, clickFn, cname, triggerForm}: IButton) => {
    return (
        <button 
            type={ triggerForm ? 'submit' : 'button'} 
            onClick={clickFn} 
            className={cname}
        >

            {children}

        </button>
    )
}


export default Button