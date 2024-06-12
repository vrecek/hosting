import '@/css/LayoutNavigation.css'
import Logo from './Logo'
import NavigationIcons from './NavigationIcons'


const LayoutNavigation = () => {
    return (
        <nav className="layout-navigation">

            <Logo />
            <NavigationIcons />

        </nav>
    )
}


export default LayoutNavigation