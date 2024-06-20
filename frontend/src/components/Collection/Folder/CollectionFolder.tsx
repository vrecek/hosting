import Icon from "@/components/Common/Icon"
import { FolderElement } from "@/interfaces/CollectionInterfaces"
import { FaRegFolder } from "react-icons/fa6"
import { useNavigate } from "react-router-dom"


const CollectionFolder = ({ folder_name, items_len, folder_tree }: FolderElement) => {
    const n = useNavigate()
    const redirectFolder = () => n('/collection', { state: { folderTree: folder_tree }})

    
    return (
        <article onClick={redirectFolder} className="collection-folder">

            <Icon icon={<FaRegFolder />} />
            <p className="title">{folder_name}</p>
            <p className="num">{items_len} items</p>

        </article>
    )
}


export default CollectionFolder