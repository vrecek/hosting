import { FileTypes } from "@/interfaces/UserInterfaces"
import { BiSolidMoviePlay } from "react-icons/bi"
import { AiOutlineFileUnknown } from "react-icons/ai"
import { FaImage, FaCode, FaMusic, FaFileAlt } from "react-icons/fa"


const iconFromFileType = (filetype: FileTypes): JSX.Element => {
    switch (filetype)
    {
        case 'picture': return <FaImage />
        case 'video': return <BiSolidMoviePlay />
        case 'code': return <FaCode />
        case 'music': return <FaMusic />
        case 'txt': return <FaFileAlt />
        case 'other': 
        default: return <AiOutlineFileUnknown />
    }
}


export default iconFromFileType