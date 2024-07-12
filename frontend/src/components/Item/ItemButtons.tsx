import { IItemButtons, ItemLocation } from "@/interfaces/ItemInterfaces"
import IconButton from "../Common/IconButton"
import { FaDownload } from "react-icons/fa6"
import { MdDelete } from "react-icons/md"
import defaultLoad from "@/utils/DefaultLoad"
import Client from "@/utils/Client"
import { Location, useLocation, useNavigate } from "react-router-dom"


const ItemButtons = ({ id }: IItemButtons) => {
    const l: Location<ItemLocation> = useLocation(),
          n  = useNavigate(),
          rb = new Client.ResultBox('error')

    
    const download = (): void => {
        window.open(`${import.meta.env.VITE_ITEM_DOWNLOAD}/${id}`, '_blank')
    }

    const deleteitem = async (e: React.MouseEvent): Promise<void> => {
        const t:   HTMLElement = e.currentTarget!.parentElement!.parentElement!,
              url: string = `${import.meta.env.VITE_ITEM_DELETE}/${id}`,
              load = defaultLoad(t)


        const [err] = await Client.Fetches.http(url, 'DELETE', {
            credentials: 'include'
        })

        load.remove()

        if (err)
        {
            rb.setStyles({ pos: 'fixed', top: '0', left: '50%', translate: '-50% 0', width: '50%' })
              .append(document.body, err.serverMsg, 'resultbox')
              .fadeAnimation()
              .remove(3000)

            return
        }

        n('/collection', {
            replace: true,
            state: { folderTree: l.state.tree, pull: id }
        })
    }


    return (
        <section className="item-buttons">

            <IconButton clickFn={download} icon={<FaDownload />} cname="item-download" />
            <IconButton clickFn={deleteitem} icon={<MdDelete />} cname="item-delete" />

        </section>
    )
}


export default ItemButtons