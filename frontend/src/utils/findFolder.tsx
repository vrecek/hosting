import { ICollectionFolder } from "@/interfaces/UserInterfaces"


const _nextFolder = (searchFor: string, item: ICollectionFolder): ICollectionFolder | undefined => {
    if (item.tree === searchFor)
        return item

    for (const x of item.items.filter(y => y.itemtype === 'folder'))
    {
        const found: ICollectionFolder | undefined = _nextFolder(searchFor, x as ICollectionFolder)
        if (found) return found
    }
}


const findFolder = (searchFor: string, savedObj?: ICollectionFolder[]): ICollectionFolder | null => {
    if (!savedObj) return null

    for (const folder of savedObj)
    {
        const found: ICollectionFolder | undefined = _nextFolder(searchFor, folder)
        if (found) return found
    }

    return null
}


export default findFolder