import Button from "@/components/Common/Button"
import Input from "@/components/Common/Input"
import PasswordInputs from "./PasswordInputs"
import CheckboxInput from "./CheckboxInput"
import Client from "@/utils/Client"
import React from "react"
import credentialsAction from "@/utils/Login_Register"


const Signin = () => {
    const [box] = React.useState(new Client.ResultBox())

    const signinFn = async (e: React.FormEvent): Promise<void> => {
        await credentialsAction(
            e, import.meta.env.VITE_USER_SIGNIN, box, 'Successfully logged in',
            (ele: HTMLInputElement[]) => {
                const [u, p, r] = ele.map(x => x.type === 'checkbox' ? x.checked : x.value)

                return {
                    username: u,
                    password: p,
                    remember: r
                }
            },
            () => window.location.href = '/'
        )
    }


    return (
        <form className="signin-form" onSubmit={signinFn}>

            <Input type="text" label="Username" />
            <PasswordInputs onlyOne={true} />
            <CheckboxInput label="Remember me" id="remember" />

            <Button triggerForm>Sign in</Button>

        </form>
    )
}


export default Signin