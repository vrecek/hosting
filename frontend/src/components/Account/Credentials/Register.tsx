import Button from "@/components/Common/Button"
import Input from "@/components/Common/Input"
import ReCAPTCHA from "react-google-recaptcha"
import PasswordInputs from "./PasswordInputs"
import CheckboxInput from "./CheckboxInput"
import Client from "@/utils/Client"
import React from "react"


const Register = () => {
    const captcha_ref = React.useRef<any>(null)
    const [box]       = React.useState(new Client.ResultBox())

    const registerFn = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault()

        const t:   HTMLFormElement    = e.currentTarget! as HTMLFormElement,
              ele: HTMLInputElement[] = [...t.elements] as HTMLInputElement[]

        const load = new Client.Loading()
        load.defaultStyleDots({
            backgroundClr: 'rgba(30, 30, 30, .75)',
            clr1: 'royalblue',
            dotSize: 15,
            position: 'absolute'
        }).append(t)

        const [u, m, p, p2, ch, ca] = ele.map(x => x.type === 'checkbox' ? x.checked : x.value)
        const [err] = await Client.Fetches.http(import.meta.env.VITE_USER_REGISTER, 'POST', {
            body: {
                username: u,
                mail: m,
                password: p,
                confirm_password: p2,
                checkbox: ch,
                captcha: ca
            }
        })

        load.remove()

        box.setType(err ? 'error' : 'success')
           .setStyles({ pos: 'absolute', top: '0', left: '0', width: '100%', padding: '1.25em' })
           .append(t, err ? err.serverMsg : 'Successfully created')
           .fadeAnimation()
           .remove(2000)

        if (!err)
            ele.map(x => x.value = '')

        captcha_ref!.current.reset()
    }


    return (
        <form className="register-form" onSubmit={registerFn}>

            <Input type="text" label="Username" />
            <Input type="text" label="E-mail" />
            <PasswordInputs />
            <CheckboxInput id="tos" label="Accept ToS" cname="tos" />
            <ReCAPTCHA ref={captcha_ref} sitekey={import.meta.env.VITE_CAPTCHA_CLIENT} />

            <Button>Register</Button>

        </form>
    )
}


export default Register