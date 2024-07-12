import { i } from "../Server"
import { CollectionFolder, ItemType } from "../interfaces/UserSchema"
import findItem from "./findItem"


const findFolder = (savedObj: CollectionFolder, searchTreeFor: string): i.Maybe<CollectionFolder> => {
    return findItem(savedObj, (x: ItemType) => {
        return x.itemtype === 'folder' && 
               x.tree === searchTreeFor
    }) as i.Maybe<CollectionFolder>
}


export default findFolder