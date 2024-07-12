import Image from "../Common/Image"
import ToggleItemContent from "./ToggleItemContent"
import React from "react"
import { IItemContent } from "@/interfaces/ItemInterfaces"


const ItemContent = ({ itemURL, filetype }: IItemContent) => {
    const [toggled, setToggle]  = React.useState<boolean>(false)
    const [content, setContent] = React.useState<JSX.Element>(<></>)

    React.useEffect(() => {
        (async () => {
            let ftype: string = itemURL.slice(itemURL.lastIndexOf('.') + 1)

            switch (filetype)
            {
                case 'txt':
                case 'code':
                    const get:  Response = await fetch(itemURL, { credentials: 'include' }),
                          data: string   = await get.text()

                    setContent(<p className="text">{data}</p>)
                break

                case 'video':
                    setContent(
                        <video controls>
                            <source src={itemURL} type={`video/${ftype}`} />
                        </video>
                    )
                break

                case 'music':
                    if (ftype === 'mp3') ftype = 'mpeg'

                    setContent(
                        <audio controls>
                            <source src={itemURL} type={`audio/${ftype}`} />
                        </audio>
                    )
                break

                case 'picture':
                    setContent(
                        <Image
                            source={itemURL}
                            altTxt='file' 
                            cname='item-preview'
                       />
                    )
                break
    
                default:
                    setContent(<p className="other">No preview available</p>)
            }
        })()
    }, [])


    return (
        <section className="item-content">

            <ToggleItemContent 
                toggled={toggled}
                setToggle={setToggle}
            />

            <section className="content">

                { toggled && content }

            </section>
            

        </section>
    )
}


export default ItemContent