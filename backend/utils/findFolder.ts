import { i } from "../Server"
import { CollectionFolder } from "../interfaces/UserSchema"


const _nextFolder = (searchTreeFor: string, item: CollectionFolder): i.Maybe<CollectionFolder> => {
    if (item.tree === searchTreeFor)
        return item

    for (const x of item.items.filter(y => y.itemtype === 'folder'))
    {
        const found: i.Maybe<CollectionFolder> = _nextFolder(searchTreeFor, x as CollectionFolder)
        if (found) return found
    }
}


const findFolder = (searchTreeFor: string, savedObj: CollectionFolder[]): i.Maybe<CollectionFolder> => {
    for (const folder of savedObj)
    {
        const found: i.Maybe<CollectionFolder> = _nextFolder(searchTreeFor, folder)
        if (found) return found
    }

    return null
}


export default findFolder