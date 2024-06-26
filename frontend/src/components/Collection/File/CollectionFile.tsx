import Icon from "@/components/Common/Icon"
import { ICollectionFile } from "@/interfaces/UserInterfaces"
import iconFromFileType from "@/utils/IconFromFiletype"


const CollectionFile = ({filetype, name, sizeBytes, tree, _id }: ICollectionFile) => {
    const redirectFn = (): void => {
        console.log(tree)
    }


    return (
        <article onClick={redirectFn} className="collection-file">

            <Icon icon={iconFromFileType(filetype)} />
            <p className="name">{name}</p>
            <p className="size">{(sizeBytes / 2 ** 20).toFixed(2)} MB</p>

        </article>
    )
}


export default CollectionFile