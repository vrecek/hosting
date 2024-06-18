import { ICollectionHeader } from "@/interfaces/CollectionInterfaces"
import { useNavigate } from "react-router-dom"
import { FaFolder } from "react-icons/fa"
import Icon from "../Common/Icon"
import React from "react"


const CollectionHeader = ({ prevFolders, current }: ICollectionHeader) => {
    const n = useNavigate()

    const redirectFolder = (folderName: string): void => 
        n('/collection', { state: { folderName } })
    


    return (
        <section className='header-section'>
            
            <h1>My collection</h1>

            <div>

                <Icon icon={<FaFolder />} cname="folder-icon" />

                {
                    prevFolders.map((x, i) => (
                        <React.Fragment key={i}>

                            <span className="prev" onClick={() => redirectFolder(x)}>
                                {x}
                            </span>

                            <span className="gt">&gt;</span>

                        </React.Fragment>
                    ))
                }

                    <span className="current">{current}</span>

            </div>

        </section>
    )
}


export default CollectionHeader