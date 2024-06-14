import Button from "@/components/Common/Button"
import Input from "@/components/Common/Input"
import { FormEvent } from "react"
import ReCAPTCHA from "react-google-recaptcha"
import PasswordInputs from "./PasswordInputs"


const Register = () => {
    const registerFn = (e: FormEvent): void => {
        e.preventDefault()
    }


    return (
        <form className="register-form" onSubmit={registerFn}>

            <Input type="text" label="Username" />
            <Input type="text" label="E-mail" />
            <PasswordInputs />
            <ReCAPTCHA sitekey={import.meta.env.VITE_CAPTCHA_CLIENT} />

            <Button>Register</Button>

        </form>
    )
}


export default Register