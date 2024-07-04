import Image from '@/components/Common/Image'
import MovieIcons from './MovieIcons'
import { MovieAddData } from '@/interfaces/CollectionInterfaces'
import Client from '@/utils/Client'


const CollectionMovie = ({ thumbnail, length, size, title }: MovieAddData) => {
    return (
        <article className="collection-movie">

            <Image source={thumbnail} altTxt='thumbnail' />

            <div className="time-type">

                <p className="time">{Client.secondsToTimeString(length)}</p>
                <p className="type">{Client.bytesToReadable(size)}</p>

            </div>

            <div className="title-icons">

                <MovieIcons />

                <p className="title">{title}</p>

            </div>

        </article>
    )
}


export default CollectionMovie