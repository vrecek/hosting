import { CollectionFolder } from "../interfaces/UserSchema"


const _nextFolder = (trees: string[], item: CollectionFolder, arr: string[]): void => {
    for (const [i, x] of Object.entries(item.items))
    {
        if (trees.some(y => y === x.tree))
            arr.push(`.${i}.items`)

        if (x.itemtype === 'folder')
            _nextFolder(trees, x as CollectionFolder, arr)
    }
}


const findUpdateString = (tree: string, savedObj: CollectionFolder[]): string => {
    const splt:  string[] = tree.split('/'),
          trees: string[] = [tree, ...splt.map((_, i) => splt.slice(0, i).join('/')).slice(1)].toReversed(),
          indx:  string[] = []

    for (const [i, x] of Object.entries(savedObj))
    {
        if (splt[0] === x.tree)
            indx.push(`.${i}.items`)

        _nextFolder(trees, x, indx)
    }

    return `saved${indx.join('')}`
}


export default findUpdateString