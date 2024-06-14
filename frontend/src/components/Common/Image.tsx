import { IImage } from "@/interfaces/CommonInterfaces"


const Image = ({ cname, source, altTxt }: IImage) => {
    return (
        <figure className={cname}>

            <img src={source} alt={altTxt} loading="lazy" />

        </figure>
    )
}


export default Image