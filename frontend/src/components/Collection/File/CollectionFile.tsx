import Icon from "@/components/Common/Icon"
import { ICollectionFileElement } from "@/interfaces/CollectionInterfaces"
import Client from "@/utils/Client"
import iconFromFileType from "@/utils/IconFromFiletype"
import { useNavigate } from "react-router-dom"


const CollectionFile = ({filetype, name, sizeBytes, _id, tree }: ICollectionFileElement) => {
    const n = useNavigate()
    const redirectFn = (): void => n('/item', {
        state: { id: _id, tree }
    })


    return (
        <article onClick={redirectFn} className="collection-file">

            <Icon icon={iconFromFileType(filetype)} />
            <p className="name">{name}</p>
            <p className="size">{Client.bytesToReadable(sizeBytes)}</p>

        </article>
    )
}


export default CollectionFile