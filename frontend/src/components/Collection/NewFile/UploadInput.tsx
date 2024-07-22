import Icon from "@/components/Common/Icon"
import { IUploadInput } from "@/interfaces/CollectionInterfaces"
import { Maybe } from "@/interfaces/CommonInterfaces"
import { CiFileOn } from "react-icons/ci"


const UploadInput = ({ setSect }: IUploadInput) => {
    const uploadFn = (e: React.ChangeEvent) => {
        const t:    HTMLInputElement = e.currentTarget! as HTMLInputElement,
              file: Maybe<File>      = t.files?.[0]

        if (!file)
        {
            setSect(null)
            return
        }

        const dotIndex: number = file.name.indexOf('.'),
              fname:    string = dotIndex !== -1 ? file.name.slice(0, dotIndex) : file.name,
              ftype:    string = dotIndex !== -1 ? file.name.slice(dotIndex + 1) : 'unknown'

        setSect({
            filename: fname,
            filetype: ftype,
            filesize: file.size,
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