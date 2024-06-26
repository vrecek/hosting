import { IManageOptions } from "@/interfaces/CollectionInterfaces"
import NewFolder from "./NewFolder"
import DeleteFolder from "./DeleteFolder"
import React from "react"
import NewFile from "./NewFile/NewFile"


const ManageOptions = ({ currentTree, name }: IManageOptions) => {
    const [menu, setMenu] = React.useState<JSX.Element | null>(null)


    return (
        <section className="manage-options">

            {menu}

            <NewFile setMenu={setMenu} currentTree={currentTree} />
            <NewFolder setMenu={setMenu} currentTree={currentTree} />
            {
                currentTree !== 'root' &&
                    <DeleteFolder name={name} setMenu={setMenu} currentTree={currentTree} />
            }

        </section>
    )
}


export default ManageOptions