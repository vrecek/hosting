import KeyValue from "../KeyValue"
import { FaRegFloppyDisk, FaLocationDot } from "react-icons/fa6"
import { FaFileAlt } from "react-icons/fa"
import { IoTime } from "react-icons/io5"
import { FaInfoCircle } from "react-icons/fa"
import ItemButtons from "../ItemButtons"
import Client from "@/utils/Client"
import { IFileArticle } from "@/interfaces/ItemInterfaces"


const FileArticle = ({ tree, sizeBytes, note, filetype, name, created, _id }: IFileArticle) => {
    return (
        <article className="item-article">

            <h1>{name}</h1>

            <KeyValue icon={<FaLocationDot />} name="Location" value={tree} />
            <KeyValue icon={<FaRegFloppyDisk />} name="Size" value={Client.bytesToReadable(sizeBytes)} />
            <KeyValue icon={<FaFileAlt />} name="Type" value={filetype} />
            <KeyValue icon={<IoTime />} name="Uploaded" value={Client.numberToDateString(created)} />
            <KeyValue icon={<FaInfoCircle />} name="Note" value={note} />

            <ItemButtons outputname={name.slice(0, name.indexOf('.'))} id={_id} />

        </article>
    )
}


export default FileArticle