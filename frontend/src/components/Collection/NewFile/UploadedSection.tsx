import Input from "@/components/Common/Input"
import FileInfo from "./FileInfo"
import { UploadSectionValue } from "@/interfaces/CollectionInterfaces"
import Client from "@/utils/Client"


const UploadedSection = ({ filename, filetype, filesize }: UploadSectionValue) => {
    return (
        <section className="uploaded-section">

            <Input label="File name" type="text" defVal={filename} />
            <FileInfo label="File type" value={filetype} />
            <FileInfo label="Size" value={Client.bytesToReadable(filesize)} />
            <Input type='text' label="Note" />

        </section>
    )
}


export default UploadedSection