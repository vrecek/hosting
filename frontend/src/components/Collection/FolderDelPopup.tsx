import { IManageDelete } from "@/interfaces/CollectionInterfaces"
import { useNavigate } from "react-router-dom"
import React from "react"
import defaultLoad from "@/utils/DefaultLoad"
import Client from "@/utils/Client"
import ButtonDiv from "./ButtonDiv"
import defaultFixedResult from "@/utils/DefaultResult"


const FolderDelPopup = ({ currentTree, setMenu, name, id }: IManageDelete) => {
    const n = useNavigate()
    const cancelMenu = (): void => setMenu(null)

    const deleteFn = async (e: React.MouseEvent): Promise<void> => {
        const t: HTMLElement = e.currentTarget! as HTMLElement,
              s: HTMLElement = t.parentElement!.parentElement!

        const load = defaultLoad(s)
        
        const [err] = await Client.Fetches.http(import.meta.env.VITE_USER_DELETEFOLDER, 'DELETE', {
            credentials: 'include',
            body: {
                foldername: name,
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
        
        n('/collection', {
            state: {
                folderTree: currentTree.slice(0, currentTree.lastIndexOf('/')),
                pull: id
            }
        })
    }


    return (
        <div className="folder-del-popup popup-menu">

            <section className="menu">

                <p className="header-info">Deleting folder</p>
                <p className="name">{name}</p>

                <ButtonDiv
                    b1={{ text: 'Delete', cname: 'red', clickFn: deleteFn }}
                    b2={{ text: 'Cancel', cname: 'blue', clickFn: cancelMenu }}
                />

            </section>

        </div>
    )
}


export default FolderDelPopup