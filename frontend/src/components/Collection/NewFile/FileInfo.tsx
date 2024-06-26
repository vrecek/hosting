import { IFileType } from "@/interfaces/CollectionInterfaces"


const FileInfo = ({ value, label }: IFileType) => {
    return (
        <div className="file-type">

            <label>{label}</label>
            <p>{value}</p>

        </div>
    )
}


export default FileInfo