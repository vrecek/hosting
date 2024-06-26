import '@/css/index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './components/Home/Home'
import LayoutNavigation from './components/Layout/LayoutNavigation/LayoutNavigation'
import Profile from './components/Account/Profile/Profile'
import Collection from './components/Collection/Collection'
import Credentials from './components/Account/Credentials/Credentials'
import React from 'react'
import UserType from './interfaces/UserInterfaces'
import Client from './utils/Client'
import { Maybe } from './interfaces/CommonInterfaces'
import { AppInit } from './interfaces/LayoutInterfaces'
import defaultLoad from './utils/DefaultLoad'


const UserContext    = React.createContext<Maybe<UserType>>(null)

function App() {
    const [user, setUser] = React.useState<AppInit>({ loaded: false, user: null })

    React.useEffect(() => {
        (async () => {
            const load = defaultLoad(document.body)

            const [_, data] = await Client.Fetches.http<UserType>(
                import.meta.env.VITE_USER_AUTH, 'GET', 
                { credentials: 'include'}
            )

            setUser({
                loaded: true,
                user: data?.json
            })

            load.remove()
        })()
    }, [])


    if (user.loaded)
    return (
        <>
            <BrowserRouter>

                <UserContext.Provider value={user.user}>

                    <LayoutNavigation />

                    <Routes>

                        <Route path='/' element={<Home />} />
                        <Route path='/collection' element={<Collection />} />
                        <Route path='/account/*' element={<Credentials />} />
                        <Route path='/account' element={<Profile />} />

                    </Routes>

                </UserContext.Provider>

            </BrowserRouter>
        </>
    )

    return <></>
}


export default App
export { UserContext }