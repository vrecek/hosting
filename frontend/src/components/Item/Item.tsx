import '@/css/Item.css'
import { FetchItem, ItemLocation } from '@/interfaces/ItemInterfaces'
import Client from '@/utils/Client'
import defaultLoad from '@/utils/DefaultLoad'
import React from 'react'
import { Location, useLocation, useNavigate } from 'react-router-dom'
import { Maybe } from '@/interfaces/CommonInterfaces'
import { ICollectionFile, ICollectionMovie } from '@/interfaces/UserInterfaces'
import ItemFileElement from './ItemFileElement'
import ItemMovieElement from './ItemMovieElement'


const Item = () => {
    const [item, setItem] = React.useState<Maybe<FetchItem>>(null)
    const n = useNavigate(),
          l: Location<ItemLocation> = useLocation()

    React.useEffect(() => {
        (async () => {
            const load = defaultLoad(document.body)

            const [err, data] = await Client.Fetches.http<FetchItem>(
                `${import.meta.env.VITE_ITEM_GET}/${l.state.id}`, 
                'GET', 
                { credentials: 'include' }
            )

            load.remove()

            if (err)
            {
                n('/', { replace: true })
                return
            }

            setItem(data!.json!)
        })()
    }, [])


    if (item)
    return (
        <main className="item-page">

            {
                item.itemtype === 'file' &&
                    <ItemFileElement item={item as FetchItem<ICollectionFile>} />
            }

            {
                item.itemtype === 'movie' &&
                    <ItemMovieElement item={item as FetchItem<ICollectionMovie>} />
            }

        </main>
    )


    return <></>
}


export default Item