import Image from '@/components/Common/Image'
import { ICollectionMovieElement } from '@/interfaces/CollectionInterfaces'
import Client from '@/utils/Client'
import { useNavigate } from 'react-router-dom'


const CollectionMovie = ({ thumbnail, length, size, title, _id }: ICollectionMovieElement) => {
    const n = useNavigate()
    const redirectFn = (): void => n('/item', {
        state: { id: _id }
    })
    

    return (
        <article onClick={redirectFn} className="collection-movie">

            <Image source={thumbnail} altTxt='thumbnail' />

            <div className="time-type">

                <p className="time">{Client.secondsToTimeString(length)}</p>
                <p className="type">{Client.bytesToReadable(size)}</p>

            </div>

            <p className="title">{title}</p>

        </article>
    )
}


export default CollectionMovie