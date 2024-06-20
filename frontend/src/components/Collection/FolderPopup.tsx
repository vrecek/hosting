import { IFolderPopup } from "@/interfaces/CollectionInterfaces"
import Button from "../Common/Button"
import Client from "@/utils/Client"


const FolderPopup = ({ setMenu, currentTree }: IFolderPopup) => {
    const cancel = (): void => setMenu(false)

    const save = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault()

        const t: HTMLFormElement  = e.currentTarget! as HTMLFormElement,
              i: HTMLInputElement = t.elements[0] as HTMLInputElement

        const load = new Client.Loading()
        load.defaultStyleDots({
            backgroundClr: 'rgba(30, 30, 30, .5)',
            position: 'absolute',
            dotSize: 15 
        }).append(t)

        const [err] = await Client.Fetches.http(import.meta.env.VITE_USER_NEWFOLDER, 'PATCH', {
            credentials: 'include',
            body: {
                foldername: i.value,
                atFolder: currentTree
            }
        })

        load.remove()

        if (err)
        {
            new Client.ResultBox('error')
                      .setStyles({ top: '0', left: '50%', width: '50%', translate: '-50% 0', pos: 'fixed' })
                      .fadeAnimation()
                      .append(document.body, err.serverMsg)
                      .remove(2000)

            return
        }
        
        setMenu(false)
        // append to items
    }


    return (
        <div className="folder-popup">

            <form onSubmit={save}>

                <p>Folder name</p>    
                <input type='text' />

                <div>

                    <Button triggerForm cname="save">
                        Confirm
                    </Button>

                    <Button clickFn={cancel} cname="cancel">
                        Cancel
                    </Button>

                </div>

            </form>   

        </div>
    )
}


export default FolderPopup