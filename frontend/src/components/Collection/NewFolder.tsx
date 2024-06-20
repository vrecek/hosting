import { FaFolderPlus } from "react-icons/fa"
import Icon from "../Common/Icon"
import React from "react"
import FolderPopup from "./FolderPopup"
import { CurrentFolder } from "@/interfaces/CollectionInterfaces"


const NewFolder = ({ currentTree }: CurrentFolder) => {
    const [menu, setMenu] = React.useState<boolean>(false)

    const addFolder = (): void => setMenu(true)


    return (
        <section className="new-folder">

            {
                menu && <FolderPopup currentTree={currentTree} setMenu={setMenu} /> 
            }

            <Icon 
                clickFn={addFolder}
                cname="new-folder"
                icon={<FaFolderPlus />} 
            />

        </section>
        
    )
}


export default NewFolder