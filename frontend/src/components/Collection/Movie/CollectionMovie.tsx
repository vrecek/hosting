import Image from '@/components/Common/Image'
import img from '@/images/sample1.png'
import MovieIcons from './MovieIcons'


const CollectionMovie = () => {
    return (
        <article className="collection-movie">

            <Image source={img} altTxt='thumbnail' />

            <div className="time-type">

                <p className="time">02:35:58</p>
                <p className="type">2.04 GB</p>

            </div>

            <div className="title-icons">

                <MovieIcons />

                <p className="title">Movie title lorem ipsum</p>

            </div>

        </article>
    )
}


export default CollectionMovie