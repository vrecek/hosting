import { IManageOptions } from "@/interfaces/CollectionInterfaces"
import React from "react"
import IconButton from "../Common/IconButton"
import { FaFileMedical, FaFolderMinus, FaFolderPlus } from "react-icons/fa"
import FileAddPopup from "./NewFile/FileAddPopup"
import FolderPopup from "./FolderPopup"
import FolderDelPopup from "./FolderDelPopup"


const ManageOptions = ({ currentTree, name, id }: IManageOptions) => {
    const [menu, setMenu] = React.useState<JSX.Element | null>(null)

    const addFileMenu      = (): void => setMenu(<FileAddPopup currentTree={currentTree} setMenu={setMenu} />)
    const addFolderMenu    = (): void => setMenu(<FolderPopup currentTree={currentTree} setMenu={setMenu} />)
    const deleteFolderMenu = (): void => setMenu(<FolderDelPopup id={id} name={name} currentTree={currentTree} setMenu={setMenu} />)
    

    return (
        <section className="manage-options">

            {menu}

            <IconButton clickFn={addFileMenu} cname="new-file" icon={<FaFileMedical />} />
            <IconButton clickFn={addFolderMenu} cname="new-folder" icon={<FaFolderPlus />} />
            {
                currentTree !== 'root' &&
                    <IconButton clickFn={deleteFolderMenu} cname="delete-folder" icon={<FaFolderMinus />} />
            }

        </section>
    )
}


export default ManageOptions