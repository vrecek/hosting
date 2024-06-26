import { IManageDelete } from "@/interfaces/CollectionInterfaces"
import Icon from "../Common/Icon"
import { FaFolderMinus } from "react-icons/fa"
import FolderDelPopup from "./FolderDelPopup"


const DeleteFolder = ({ currentTree, setMenu, name }: IManageDelete) => {
    const deleteFolderMenu = (): void => {
        setMenu(
            <FolderDelPopup name={name} currentTree={currentTree} setMenu={setMenu} />
        )
    }


    return (
        <section className="delete-folder">

            <Icon 
                icon={<FaFolderMinus />}
                cname="manage-icon"
                clickFn={deleteFolderMenu}
            />

        </section>
    )
}

export default DeleteFolder