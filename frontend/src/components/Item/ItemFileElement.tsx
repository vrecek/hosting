import { IItemFileElement } from "@/interfaces/ItemInterfaces"
import FileArticle from "./File/FileArticle"
import FileContent from "./File/FileContent"
import { ICollectionFile } from "@/interfaces/UserInterfaces"


const ItemFileElement = ({ item }: IItemFileElement<ICollectionFile>) => {
    return (
        <section className="item-file-element">

            <FileArticle
                filetype={item.filetype}
                created={item.created}
                note={item.note}
                _id={item._id}
                itemtype={item.itemtype}
                name={item.name}
                sizeBytes={item.sizeBytes}
                tree={item.tree}
            />

            <FileContent 
                itemURL={item.itemURL}
                filetype={item .filetype}
            />

        </section>
    )
}

export default ItemFileElement