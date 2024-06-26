import Icon from "@/components/Common/Icon"
import { IUploadInput } from "@/interfaces/CollectionInterfaces"
import { Maybe } from "@/interfaces/CommonInterfaces"
import { CiFileOn } from "react-icons/ci"


const UploadInput = ({ setSect }: IUploadInput) => {
    const uploadFn = (e: React.ChangeEvent) => {
        const t:    HTMLInputElement = e.currentTarget! as HTMLInputElement,
              file: Maybe<File>      = t.files?.[0]

        if (!file)
            setSect(null)
        
        setSect({
            filename: file!.name.slice(0, file!.name.indexOf('.')),
            filetype: file!.type,
            filesize: file!.size,
            movie: undefined
        })
    }


    return (
        <section className="file-upload">

            <label className="file-label" htmlFor="upload-input">

                <Icon icon={<CiFileOn />} />
                Upload

            </label>

            <input onChange={uploadFn} type='file' id='upload-input' />

        </section>
    )
}


export default UploadInput