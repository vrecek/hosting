import { IIcon } from "@/interfaces/CommonInterfaces"
import MovieIconOption from "./MovieIconOption"
import { FaDownload } from "react-icons/fa6"
import { FaArrowAltCircleRight } from "react-icons/fa"
import { AiFillInfoCircle } from "react-icons/ai";

const MovieIcons = () => {
    const icons: IIcon[] = [
        { icon: <FaDownload /> },
        { icon: <FaArrowAltCircleRight /> },
        { icon: <AiFillInfoCircle /> }
    ]


    return (
        <section className="movie-icons">

            {
                icons.map((x, i) => (
                    <MovieIconOption 
                        icon={x.icon}
                        clickFn={x.clickFn}
                        cname={x.cname}
                        key={i}
                    />
                ))
            }

        </section>
    )
}


export default MovieIcons