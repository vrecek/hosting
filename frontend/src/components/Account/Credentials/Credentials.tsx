import React from "react"
import { useNavigate } from "react-router-dom"
import '@/css/Credentials.css'
import SelectMenu from "./SelectMenu"
import Signin from "./Signin"
import Register from "./Register"
import { UserContext } from "@/App"
import { Maybe } from "@/interfaces/CommonInterfaces"
import UserType from "@/interfaces/UserInterfaces"
import { MdAccountBalance } from "react-icons/md"
import Icon from "@/components/Common/Icon"
import BodyBackground from "@/components/Layout/BodyBackground"


const Credentials = () => {
    const n = useNavigate()
    const [display, setDisplay] = React.useState<Maybe<JSX.Element>>(null)
    const UserC: Maybe<UserType> = React.useContext(UserContext)
    
    const pathname: string = window.location.pathname.split('/')[2]
    
    React.useEffect(() => {
        if (UserC)
        {
            n('/', { replace: true })
            return
        }

        const m: HTMLElement[] = [...document.querySelector('.credentials .select-menu')!.children] as HTMLElement[],
              l: HTMLElement   = m[1]

        if (pathname === 'signin')
        {
            l.style.left = '0'
            l.style.width = `${m[0].clientWidth}px`
            setDisplay(<Signin />)
        }
        else if (pathname === 'register')
        {
            l.style.left = `${m[2].offsetLeft}px`
            l.style.width = `${m[2].clientWidth}px`
            setDisplay(<Register />)
        }
        else
            n('/', { replace: true })

    }, [window.location.pathname])


    return (
        <main className="credentials">

            <BodyBackground />

            <div className="wrapper">

                <section className="left-section">

                    <Icon icon={<MdAccountBalance />} />

                </section>

                <section className={`main-container ${pathname}`}>

                    <SelectMenu />
                    
                    {display}

                </section>

            </div>

        </main>
    )
}


export default Credentials