import '@/css/Collection.css'
import CollectionHeader from './CollectionHeader'
import CollectionMovie from './Movie/CollectionMovie'
import CollectionFolder from './Folder/CollectionFolder'
import CollectionFile from './File/CollectionFile'
import React from 'react'
import { Maybe } from '@/interfaces/CommonInterfaces'
import UserType from '@/interfaces/UserInterfaces'
import { UserContext } from '@/App'
import { Location, useLocation, useNavigate } from 'react-router-dom'
import { ItemsObject, LocationState } from '@/interfaces/CollectionInterfaces'


const Collection = () => {
    const [user] = React.useState<Maybe<UserType>>(React.useContext(UserContext))
    const [items, setItems] = React.useState<Maybe<ItemsObject>>(null)
    const l: Location<LocationState> = useLocation()
    const n = useNavigate()

    React.useEffect(() => {
        if (!user)
        {
            n('/', { replace: true })
            return
        }

        const currentFolder: string = l.state?.folderName ?? 'root' 

        const items: ItemsObject = {
            itemtype: 'folder',
            name: currentFolder,
            prevFolders: [], // fetch
            items: [] //fetch for currentFolder
        }

        setItems(items)
    }, [l])


    if (items)
    return (
        <main className="collection">

            <CollectionHeader prevFolders={items.prevFolders} current={items.name} />

            <section className="main-container">

                {
                    items.items.map((x, i) => {
                        switch (x.itemtype)
                        {
                            case 'file':
                                return <CollectionFile key={i} />
                            case 'folder':
                                return <CollectionFolder key={i} />
                            case 'movie':
                                return <CollectionMovie key={i} />
                            default: 
                                return <></>
                        }
                    })
                }

            </section>

        </main>
    )

    return <></>
}


export default Collection