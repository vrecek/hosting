import '@/css/Item.css'
import { FetchItem, ItemLocation } from '@/interfaces/ItemInterfaces'
import Client from '@/utils/Client'
import defaultLoad from '@/utils/DefaultLoad'
import React from 'react'
import { Location, useLocation, useNavigate } from 'react-router-dom'
import FileArticle from './FileArticle'
import { Maybe } from '@/interfaces/CommonInterfaces'
import { ICollectionFile } from '@/interfaces/UserInterfaces'
import FileContent from './FileContent'


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
                (<>
                    <FileArticle
                        filetype={(item as ICollectionFile).filetype}
                        created={item.created}
                        note={item.note}
                        _id={item._id}
                        itemtype={item.itemtype}
                        name={item.name}
                        sizeBytes={item.sizeBytes}
                        tree={item.tree}
                    />

                    <FileContent 
                        itemURL={item.itemURL}
                        filetype={(item as ICollectionFile).filetype}
                    />
                </>)
                    
            }

        </main>
    )


    return <></>
}


export default Item