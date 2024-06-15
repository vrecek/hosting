import '@/css/Home.css'
import Button from '../Common/Button'
import Image from '../Common/Image'
import img from '@/images/home1n.png'
import { Link } from 'react-router-dom'


const Home = () => {
    return (
        <main className="homepage">

            <Image source={img} />

            <article>

                <h1>Lorem ipsum dolorsit amet</h1>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis doloribus aliquam modi repellat hic ea officiis labore magnam, natus sapiente</p>
                <Button>
                    <Link to='/account/signin'>Sign in</Link>
                </Button>

            </article>

        </main>
    )
}


export default Home