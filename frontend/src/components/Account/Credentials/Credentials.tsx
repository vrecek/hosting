import React from "react"
import { useNavigate } from "react-router-dom"
import '@/css/Credentials.css'
import SelectMenu from "./SelectMenu"
import Signin from "./Signin"
import Register from "./Register"


const Credentials = () => {
    const n = useNavigate()
    const [display, setDisplay] = React.useState<JSX.Element | null>(null)
    
    const pathname: string = window.location.pathname.split('/')[2]
    
    React.useEffect(() => {
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

            <section className={`main-container ${pathname}`}>

                <SelectMenu />
                
                {display}

            </section>

        </main>
    )
}


export default Credentials