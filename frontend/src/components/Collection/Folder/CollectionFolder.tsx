import Icon from "@/components/Common/Icon"
import { FaRegFolder } from "react-icons/fa6"


const CollectionFolder = () => {
    return (
        <article className="collection-folder">

            <Icon icon={<FaRegFolder />} />
            <p className="title">Movies</p>
            <p className="num">14 items</p>

        </article>
    )
}


export default CollectionFolder