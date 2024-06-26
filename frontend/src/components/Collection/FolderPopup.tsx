import { ICollectionContext, IFolderPopup } from "@/interfaces/CollectionInterfaces"
import Client from "@/utils/Client"
import { CollectionItemsContext } from "./Collection"
import React from "react"
import { Maybe } from "@/interfaces/CommonInterfaces"
import { ICollectionFolder } from "@/interfaces/UserInterfaces"
import defaultLoad from "@/utils/DefaultLoad"
import ButtonDiv from "./ButtonDiv"
import defaultFixedResult from "@/utils/DefaultResult"


const FolderPopup = ({ setMenu, currentTree }: IFolderPopup) => {
    const items: Maybe<ICollectionContext> = React.useContext(CollectionItemsContext)!

    const cancelMenu = (): void => setMenu(null)

    const save = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault()

        const t: HTMLFormElement  = e.currentTarget! as HTMLFormElement,
              i: HTMLInputElement = t.elements[0] as HTMLInputElement

        const load = defaultLoad(t)

        const [err] = await Client.Fetches.http(import.meta.env.VITE_USER_NEWFOLDER, 'PATCH', {
            credentials: 'include',
            body: {
                foldername: i.value,
                atFolder: currentTree
            }
        })

        load.remove()

        if (err)
        {
            defaultFixedResult(err.serverMsg)
            return
        }
        
        cancelMenu()

        items.setItems(curr => {
            curr!.items.push({
                items: [],
                itemtype: 'folder',
                name: i.value,
                tree: `${currentTree}/${i.value}`
            } as ICollectionFolder)

            return {...curr!}
        })
    }


    return (
        <div className="folder-add-popup popup-menu">

            <form onSubmit={save}>

                <p>Folder name</p>    
                <input type='text' />

                <ButtonDiv
                    b1={{ text: 'Confirm', cname: 'blue', trigger: true }}
                    b2={{ text: 'Cancel', cname: 'red', clickFn: cancelMenu }}
                />

            </form>   

        </div>
    )
}


export default FolderPopup