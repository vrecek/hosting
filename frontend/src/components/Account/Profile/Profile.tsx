import { UserContext } from "@/App"
import { Maybe } from "@/interfaces/CommonInterfaces"
import UserType from "@/interfaces/UserInterfaces"
import React from "react"
import { useNavigate } from "react-router-dom"
import Logout from "./Logout"
import '@/css/Profile.css'
import DeleteAccount from "./DeleteAccount"


const Profile = () => {
    const [user] = React.useState<Maybe<UserType>>(React.useContext(UserContext))
    const n = useNavigate()

    React.useEffect(() => {
        if (!user)
            n('/', { replace: true })
    }, [])
    

    if (user)
    return (
        <main className="user-profile">

            <Logout />
            <DeleteAccount />

        </main>
    )

    return <></>
}


export default Profile