import '@/css/Home.css'
import Button from '../Common/Button'
import Image from '../Common/Image'
import img from '@/images/home1n.png'
import { Link } from 'react-router-dom'
import { Maybe } from '@/interfaces/CommonInterfaces'
import UserType from '@/interfaces/UserInterfaces'
import { UserContext } from '@/App'
import React from 'react'


const Home = () => {
    const user: Maybe<UserType> = React.useContext(UserContext)

    const Btn:  JSX.Element = user 
        ? <Button><Link to='/collection'>Show collection</Link></Button> 
        : <Button><Link to='/account/signin'>Sign in</Link></Button> 


    return (
        <main className="homepage">

            <Image source={img} />

            <article>

                <h1>Lorem ipsum dolorsit amet</h1>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis doloribus aliquam modi repellat hic ea officiis labore magnam, natus sapiente lorem ipsum dolor</p>
                {Btn}

            </article>

        </main>
    )
}


export default Home