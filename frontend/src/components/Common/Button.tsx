import { IButton } from "@/interfaces/CommonInterfaces"


const Button = ({children, clickFn, cname}: IButton) => {
    return (
        <button onClick={clickFn} className={cname}>

            {children}

        </button>
    )
}


export default Button