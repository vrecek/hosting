import { CollectionFolder, PossibleItem } from "../interfaces/UserSchema"


const loopFolders = (savedObj: CollectionFolder[], fn: (x: PossibleItem) => void): void => {

    const _nextFolder = (item: CollectionFolder): void => {
        for (const x of item.items)
        {
            fn(x)
    
            if (x.itemtype === 'folder')
                _nextFolder(x as CollectionFolder)
        }
    }

    for (const folder of savedObj)
        _nextFolder(folder)
}


export default loopFolders