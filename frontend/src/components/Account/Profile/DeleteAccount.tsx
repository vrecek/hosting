import Button from "@/components/Common/Button"
import accountHandle from "@/utils/Logout_Delete"


const DeleteAccount = () => {
    return (
        <section className="delete-account">

            <Button clickFn={() => accountHandle(import.meta.env.VITE_USER_DELETE, 'DELETE')}>
                Delete account
            </Button>

        </section>
    )
}


export default DeleteAccount