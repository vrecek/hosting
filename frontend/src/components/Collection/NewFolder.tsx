import { FaFolderPlus } from "react-icons/fa"
import Icon from "../Common/Icon"
import FolderPopup from "./FolderPopup"
import { IManageItems } from "@/interfaces/CollectionInterfaces"


const NewFolder = ({ currentTree, setMenu }: IManageItems) => {
    const addFolderMenu = (): void => {
        setMenu(<FolderPopup currentTree={currentTree} setMenu={setMenu} />)
    }


    return (
        <section className="new-folder">

            <Icon 
                clickFn={addFolderMenu}
                cname="manage-icon"
                icon={<FaFolderPlus />} 
            />

        </section>
    )
}


export default NewFolder