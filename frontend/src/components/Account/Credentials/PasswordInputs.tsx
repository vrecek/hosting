import Icon from "@/components/Common/Icon"
import Input from "@/components/Common/Input"
import { IPasswordInputs } from "@/interfaces/AccountInterfaces"
import { Set } from "@/interfaces/CommonInterfaces"
import React from "react"
import { IoIosEye, IoIosEyeOff } from "react-icons/io"


const PasswordInputs = ({ onlyOne }: IPasswordInputs) => {
    const [eye1, setEye1] = React.useState<boolean>(false)
    const [eye2, setEye2] = React.useState<boolean>(false)

    const eyeJSX = (eye: boolean, eyeFn: Set<boolean>): JSX.Element => {
        const toggleFn = (e: React.MouseEvent): void => {
            const inp: HTMLInputElement = e.currentTarget!.parentElement!.children[0] as HTMLInputElement
            inp.type = eye ? 'password' : 'text'

            eyeFn(curr => !curr)
        }

        return (
            <Icon 
                clickFn={toggleFn}
                icon={eye ? <IoIosEye /> : <IoIosEyeOff />} 
            />
        )
    }


    return (
        <>
            <Input type="password" label="Password" addEle={eyeJSX(eye1, setEye1)} />
            {
                !onlyOne && 
                    <Input type="password" label="Confirm password" addEle={eyeJSX(eye2, setEye2)} />
            }
        </>
    )
}


export default PasswordInputs