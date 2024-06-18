import Button from "@/components/Common/Button"
import accountHandle from "@/utils/Logout_Delete"


const Logout = () => {
    return (
        <section className="logout">

            <Button clickFn={() => accountHandle(import.meta.env.VITE_USER_LOGOUT, 'POST')}>
                Logout
            </Button>

        </section>
    )
}


export default Logout