import Button from "@/components/Common/Button"
import Input from "@/components/Common/Input"
import ReCAPTCHA from "react-google-recaptcha"
import PasswordInputs from "./PasswordInputs"
import CheckboxInput from "./CheckboxInput"
import Client from "@/utils/Client"
import React from "react"
import credentialsAction from "@/utils/Login_Register"
import { useNavigate } from "react-router-dom"


const Register = () => {
    const cref  = React.useRef<any>(null)
    const [box] = React.useState(new Client.ResultBox())
    const n     = useNavigate()

    const registerFn = async (e: React.FormEvent): Promise<void> => {
        await credentialsAction(
            e, import.meta.env.VITE_USER_REGISTER, box, 'Successfully created',
            (ele: HTMLInputElement[]) => {
                const [u, m, p, p2, ch, ca] = ele.map(x => x.type === 'checkbox' ? x.checked : x.value)

                return {
                    username: u,
                    mail: m,
                    password: p,
                    confirm_password: p2,
                    checkbox: ch,
                    captcha: ca
                }
            },
            () => n('/account/signin')
        )

        cref!.current.reset()
    }


    return (
        <form className="register-form" onSubmit={registerFn}>

            <Input type="text" label="Username" />
            <Input type="text" label="E-mail" />
            <PasswordInputs />
            <CheckboxInput id="tos" label="Accept ToS" cname="tos" />
            <ReCAPTCHA ref={cref} sitekey={import.meta.env.VITE_CAPTCHA_CLIENT} />

            <Button triggerForm>Register</Button>

        </form>
    )
}


export default Register