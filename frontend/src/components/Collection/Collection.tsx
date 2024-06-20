import '@/css/Collection.css'
import CollectionHeader from './CollectionHeader'
import CollectionMovie from './Movie/CollectionMovie'
import CollectionFolder from './Folder/CollectionFolder'
import CollectionFile from './File/CollectionFile'
import React from 'react'
import { Maybe } from '@/interfaces/CommonInterfaces'
import UserType, { ICollectionFolder } from '@/interfaces/UserInterfaces'
import { UserContext } from '@/App'
import { Location, useLocation, useNavigate } from 'react-router-dom'
import { ItemsObject, LocationState } from '@/interfaces/CollectionInterfaces'
import NewFolder from './NewFolder'
import findFolder from '@/utils/findFolder'


const Collection = () => {
    const [user] = React.useState<Maybe<UserType>>(React.useContext(UserContext))
    const [items, setItems] = React.useState<Maybe<ItemsObject>>(null)
    const l: Location<LocationState> = useLocation()
    const n = useNavigate()

    React.useEffect(() => {
        const stateFolder:   string = l.state?.folderTree ?? 'root' 
        const currentFolder: ICollectionFolder | null = findFolder(stateFolder, user?.saved)

        if (!currentFolder)
        {
            n('/', { replace: true })
            return
        }

        const items: ItemsObject = {
            itemtype: 'folder',
            name: currentFolder.name,
            tree: currentFolder.tree,
            prevFolders: currentFolder.tree.split('/').slice(0, -1),
            items: currentFolder.items
        }

        setItems(items)
    }, [l])


    if (items)
    return (
        <main className="collection">
            
            <section className="top">

                <CollectionHeader prevFolders={items.prevFolders} current={items.name} />
                <NewFolder currentTree={items.tree} />

            </section>

            <section className="main-container">

                {
                    items.items.map((x, i) => {
                        switch (x.itemtype)
                        {
                            case 'file':
                                return <CollectionFile key={i} />

                            case 'folder':
                                x = x as ICollectionFolder
                                return  <CollectionFolder 
                                            key={i} 
                                            folder_name={x.name} 
                                            folder_tree={x.tree} 
                                            items_len={x.items.length}
                                        />

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