import { IItemFileElement } from "@/interfaces/ItemInterfaces"
import { ICollectionMovie } from "@/interfaces/UserInterfaces"
import Image from "../Common/Image"


const ItemMovieElement = ({ item }: IItemFileElement<ICollectionMovie>) => {
    const vtype: string = item.itemURL.slice(item.itemURL.lastIndexOf('.') + 1)
    console.log(item.thumbnail)

    return (
        <section className="item-movie-element">

            <video controls>
                <source src={item.itemURL} type={`video/${vtype}`} />
            </video>    

            <article className="text-content">

                <Image source={item.thumbnail} altTxt="thumbnail" />

                <h1>{item.name}</h1>

                <p className="info">description</p>
                <p className="desc">{item.note}</p>

            </article>

        </section>
    )
}


export default ItemMovieElement