import { i } from "../Server"
import { CollectionFolder, ItemType, PossibleItem } from "../interfaces/UserSchema"


type Condition = (x: ItemType) => boolean

const findItem = (rootFolder: CollectionFolder, condition: Condition, __skip?: boolean): i.Maybe<PossibleItem> => {
    if (!__skip && condition(rootFolder))
        return rootFolder
    
    for (const item of rootFolder.items)
    {
        if (condition(item))
            return item

        if (item.itemtype === 'folder')
        {
            const found: i.Maybe<PossibleItem> = findItem(item as CollectionFolder, condition, true)
            if (found) return found
        }
    }
}


export default findItem