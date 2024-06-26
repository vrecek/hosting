import { FileAddData, ICollectionContext, IFilePopup, UploadSectionValue } from "@/interfaces/CollectionInterfaces"
import ButtonDiv from "../ButtonDiv"
import UploadInput from "./UploadInput"
import React from "react"
import UploadedSection from "./UploadedSection"
import { Maybe } from "@/interfaces/CommonInterfaces"
import Input from "@/components/Common/Input"
import defaultFixedResult from "@/utils/DefaultResult"
import Client from "@/utils/Client"
import { CollectionItemsContext } from "../Collection"
import { ICollectionFile, ICollectionMovie } from "@/interfaces/UserInterfaces"


const FileAddPopup = ({ currentTree, setMenu }: IFilePopup) => {
    const items: Maybe<ICollectionContext> = React.useContext(CollectionItemsContext)!

    const [upSect, setSect] = React.useState<Maybe<UploadSectionValue>>(null)

    const loadEle = (): HTMLElement => {
        const p = document.createElement('p')
        p.textContent = 'Uploading'

        return p
    }

    const saveFn = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault()

        const t:   HTMLFormElement    = e.currentTarget! as HTMLFormElement,
              ele: HTMLInputElement[] = [...t.elements].slice(0, -2) as HTMLInputElement[]

        const load = new Client.Loading('upload-load')
        load.setCustomElement(loadEle())
            .defaultStyleDots({ position: 'absolute' })
            .append(t)

        const [file, filename, asMovie, movieDesc] = ele.map(x => {
            switch (x.type)
            {
                case 'text': return x.value
                case 'checkbox': return x.checked ? 'true' : ''
                case 'file': return x.files![0] ?? null
                default: return ''
            }
        }) as [File, string, string, string]
        
        const fd: FormData = new FormData()
        fd.append('fileitem', file)
        fd.append('filename', filename)
        fd.append('isMovie', asMovie ?? '')
        fd.append('movieDesc', movieDesc ?? '')
        fd.append('currentTree', currentTree)

        const [err, data] = await Client.Fetches.http<FileAddData>(import.meta.env.VITE_USER_NEWFILE, 'POST', {
            formdataBody: fd,
            abortSignalMs: -1,
            credentials: 'include'
        })

        load.remove()

        if (err)
        {
            defaultFixedResult(err.serverMsg)
            return
        }

        items.setItems(curr => {
            const json: FileAddData = data!.json!
            const fileObj = {
                tree:      currentTree,
                itemtype:  asMovie ? 'movie' : 'file',
                sizeBytes: file!.size,
                _id:       json._id,
                name:      json.name
            }

            if (asMovie)
                curr!.items.push({
                    ...fileObj,
                    description: movieDesc,
                    length: json.movie?.length,
                    thumbnail: json.movie?.thumbnail
                } as ICollectionMovie)

            else
                curr!.items.push({
                    ...fileObj,
                    filetype: json.file?.filetype,
                } as ICollectionFile) 

            return {...curr!}
        })
            
        cancelMenu()
    }

    const movieInputFn = (e: React.ChangeEvent) => {
        const t: HTMLInputElement = e.currentTarget! as HTMLInputElement

        setSect(curr => {
            curr!.movie = t.checked

            return {...curr!}
        })
    }

    const cancelMenu = (): void => setMenu(null)


    return (
        <div className="file-add-popup popup-menu">

            <form onSubmit={saveFn}>

                <p className="header-info">Upload a file</p>
                <p className="tree-info">{currentTree}</p>

                <UploadInput setSect={setSect} />

                {
                    upSect && (
                        <UploadedSection 
                            filename={upSect.filename} 
                            filetype={upSect.filetype} 
                            filesize={upSect.filesize}
                        />
                    )
                }
                {
                    upSect?.filetype === 'video/mp4' &&
                        <Input
                            defVal={upSect.filename}
                            type="checkbox"
                            label="Mark as movie"
                            cname="movie-mark"
                            changeFn={movieInputFn}
                        />
                }
                {
                    upSect?.movie &&
                        <Input type='text' label="Description" />
                }

                <ButtonDiv
                    b1={{ text: 'Save', cname: 'blue', trigger: true }}
                    b2={{ text: 'Cancel', cname: 'red', clickFn: cancelMenu }}
                />

            </form>

        </div>
    )
}


export default FileAddPopup