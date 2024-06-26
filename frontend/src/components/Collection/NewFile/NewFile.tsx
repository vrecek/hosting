import { IManageItems } from "@/interfaces/CollectionInterfaces"
import { FaFileMedical } from "react-icons/fa"
import FileAddPopup from "./FileAddPopup"
import Icon from "@/components/Common/Icon"


const NewFile = ({ currentTree, setMenu }: IManageItems) => {
    const addFileMenu = (): void => {
        setMenu(<FileAddPopup currentTree={currentTree} setMenu={setMenu} />)
    }


    return (
        <section className="new-file">

            <Icon
                clickFn={addFileMenu}
                cname="manage-icon"
                icon={<FaFileMedical />} 
            />

        </section>
    )
}


export default NewFile