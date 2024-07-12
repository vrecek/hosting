import '@/css/Collection.css'
import CollectionHeader from './CollectionHeader'
import CollectionMovie from './Movie/CollectionMovie'
import CollectionFolder from './Folder/CollectionFolder'
import CollectionFile from './File/CollectionFile'
import React from 'react'
import { Maybe } from '@/interfaces/CommonInterfaces'
import UserType, { ICollectionFile, ICollectionFolder, ICollectionMovie } from '@/interfaces/UserInterfaces'
import { UserContext } from '@/App'
import { Location, useLocation, useNavigate } from 'react-router-dom'
import { ICollectionContext, ItemsObject, LocationState } from '@/interfaces/CollectionInterfaces'
import findFolder from '@/utils/findFolder'
import ManageOptions from './ManageOptions'


const CollectionItemsContext = React.createContext<Maybe<ICollectionContext>>(null)

const Collection = () => {
    const [user] = React.useState<Maybe<UserType>>(React.useContext(UserContext))
    const [items, setItems] = React.useState<Maybe<ItemsObject>>(null)
    const l: Location<LocationState> = useLocation()
    const n = useNavigate()

    React.useEffect(() => {
        const stateFolder:   string = l.state?.folderTree ?? 'root',
              statePull:     Maybe<string> = l.state?.pull,
              currentFolder: ICollectionFolder | null = findFolder(stateFolder, user?.saved)

        if (!currentFolder)
        {
            n('/', { replace: true })
            return
        }

        const items: ItemsObject = {
            _id: currentFolder._id,
            itemtype: 'folder',
            name: currentFolder.name,
            tree: currentFolder.tree,
            prevFolders: currentFolder.tree.split('/').slice(0, -1),
            items: currentFolder.items
        }

        if (statePull)
        {
            const i: number = items.items.findIndex(x => x._id === statePull)

            i !== -1 && items.items.splice(i, 1)
        }

        setItems(items)

    }, [l])


    if (items)
    return (
        <main className="collection">
            
            <CollectionItemsContext.Provider value={{ setItems }}>
            
                <section className="top">

                    <CollectionHeader prevFolders={items.prevFolders} current={items.name} />
                    <ManageOptions id={items._id!} name={items.name} currentTree={items.tree} />

                </section>

                <section className="main-container">

                    {
                        items.items.map((x, i) => {
                            switch (x.itemtype)
                            {
                                case 'file':
                                    x = x as ICollectionFile
                                    return <CollectionFile
                                                key={i} 
                                                filetype={x.filetype}
                                                itemtype={x.itemtype}
                                                name={x.name}
                                                sizeBytes={x.sizeBytes}
                                                tree={x.tree}
                                                _id={x._id}
                                            />

                                case 'folder':
                                    x = x as ICollectionFolder
                                    return  <CollectionFolder 
                                                key={i} 
                                                folder_name={x.name} 
                                                folder_tree={x.tree} 
                                                items_len={x.items.length}
                                            />

                                case 'movie':
                                    x = x as ICollectionMovie
                                    return <CollectionMovie 
                                                key={i} 
                                                _id={x._id}
                                                length={x.length}
                                                size={x.sizeBytes}
                                                thumbnail={x.thumbnail}
                                                title={x.name}
                                            />

                                default: 
                                    return <></>
                            }
                        })
                    }

                </section>

            </CollectionItemsContext.Provider>

        </main>
    )

    return <></>
}


export { CollectionItemsContext }
export default Collection