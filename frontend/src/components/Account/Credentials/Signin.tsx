import Button from "@/components/Common/Button"
import Input from "@/components/Common/Input"
import PasswordInputs from "./PasswordInputs"
import RememberMe from "./RememberMe"


const Signin = () => {
    const signinFn = (e: React.FormEvent): void => {

    }


    return (
        <form className="signin-form" onSubmit={signinFn}>

            <Input type="text" label="Username" />
            <PasswordInputs onlyOne={true} />
            <RememberMe />

            <Button>Sign in</Button>

        </form>
    )
}


export default Signin