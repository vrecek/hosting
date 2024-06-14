import { FaImage } from "react-icons/fa"
import { BiSolidMoviePlay } from "react-icons/bi"
import Icon from "@/components/Common/Icon"


const CollectionFile = () => {
    return (
        <article className="collection-file">

            <Icon icon={<BiSolidMoviePlay />} />
            <p className="name">arch_wallpaper1.jpg</p>
            <p className="size">2.36 MB</p>

        </article>
    )
}


export default CollectionFile