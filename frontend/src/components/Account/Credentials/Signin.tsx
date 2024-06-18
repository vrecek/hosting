import Button from "@/components/Common/Button"
import Input from "@/components/Common/Input"
import PasswordInputs from "./PasswordInputs"
import CheckboxInput from "./CheckboxInput"
import Client from "@/utils/Client"
import React from "react"


const Signin = () => {
    const [box] = React.useState(new Client.ResultBox())

    const signinFn = async (e: React.FormEvent): Promise<void> => {
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

        const [u, p, r] = ele.map(x => x.type === 'checkbox' ? x.checked : x.value)
        const [err]  = await Client.Fetches.http(import.meta.env.VITE_USER_SIGNIN, 'POST', {
            credentials: 'include',
            body: {
                username: u,
                password: p,
                remember: r
            }
        })

        load.remove()

        box.setType(err ? 'error' : 'success')
           .setStyles({ pos: 'absolute', top: '0', left: '0', width: '100%', padding: '1.25em' })
           .append(t, err ? err.serverMsg : 'Successfully logged in')
           .fadeAnimation()
           .remove(2000)

        if (!err)
        {
            ele.map(x => x.value = '')
            setTimeout(() => window.location.href = '/', 1000)
        }
    }


    return (
        <form className="signin-form" onSubmit={signinFn}>

            <Input type="text" label="Username" />
            <PasswordInputs onlyOne={true} />
            <CheckboxInput label="Remember me" id="remember" />

            <Button>Sign in</Button>

        </form>
    )
}


export default Signin