import { useNavigate } from "react-router-dom"


const SelectMenu = () => {
    const n = useNavigate()

    const changeFn = (e: React.MouseEvent, url: 'signin' | 'register'): void => {
        const t: HTMLElement   = e.currentTarget! as HTMLElement

        for (const element of [...t.parentElement!.children])
            element.className = ''

        t.className = 'active'

        n(`/account/${url}`)
    }


    return (
        <section className="select-menu">

            <p onClick={(e) => changeFn(e, 'signin')}>Sign in</p>
            <span></span>
            <p onClick={(e) => changeFn(e, 'register')}>Register</p>

        </section>
    )
}


export default SelectMenu