import { IManageDelete } from "@/interfaces/CollectionInterfaces"
import Button from "../Common/Button"
import { useNavigate } from "react-router-dom"
import React from "react"
import defaultLoad from "@/utils/DefaultLoad"
import Client from "@/utils/Client"
import defaultResult from "@/utils/DefaultResult"


const FolderDelPopup = ({ currentTree, setMenu, name }: IManageDelete) => {
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

        if (err)
        {
            defaultResult(err.serverMsg)
            load.remove()

            return
        }

        cancelMenu()

        n('/collection', {
            state: {
                folderTree: currentTree.slice(0, currentTree.lastIndexOf('/'))
            }
        })

        window.location.reload()
    }


    return (
        <div className="folder-del-popup">

            <section className="menu">

                <p className="info">Deleting folder</p>
                <p className="name">{name}</p>

                <div className="btns">

                    <Button clickFn={deleteFn} cname="delete">
                        Delete
                    </Button>

                    <Button clickFn={cancelMenu} cname="cancel">
                        Cancel
                    </Button>

                </div>

            </section>

        </div>
    )
}


export default FolderDelPopup