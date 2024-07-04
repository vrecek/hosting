import { CollectionFolder, CollectionMovie } from "../interfaces/UserSchema"


const _nextFolder = (item: CollectionFolder, protohost: string, userId: string): void => {
    for (const x of item.items)
    {
        if (x.itemtype === 'movie')
        {
            const thumbnail: string = (x as CollectionMovie).thumbnail;
            (x as CollectionMovie).thumbnail = `${protohost}/files/${userId}/thumbnails/${thumbnail}`
        }

        else if (x.itemtype === 'folder')
            _nextFolder(x as CollectionFolder, protohost, userId)
    }
}


const updateFolder = (savedObj: CollectionFolder[], protohost: string, userId: string): void => {
    for (const folder of savedObj)
        _nextFolder(folder, protohost, userId)
}


export default updateFolder