import { CollectionFolder } from "../interfaces/UserSchema"


const _nextFolder = (trees: string[], item: CollectionFolder, arr: string[]): void => {
    for (const [i, x] of Object.entries(item?.items ?? []))
    {
        if (trees.some(y => y === x.tree && x.itemtype === 'folder'))
        {
            arr.push(`.${i}.items`)

            if (arr.length === trees.length)
                return
        }

        _nextFolder(trees, x as CollectionFolder, arr)
    }
}


const findUpdateString = (tree: string, savedObj: CollectionFolder[], as: 'pull' | 'push'): string => {
    const splt:  string[] = tree.split('/'),
          trees: string[] = [tree, ...splt.map((_, i) => splt.slice(0, i).join('/')).slice(1)].toReversed(),
          indx:  string[] = []

    for (const [i, x] of Object.entries(savedObj))
    {
        if (splt[0] === x.tree)
        {
            indx.push(`.${i}.items`)
            _nextFolder(trees, x, indx)

            break
        }
    }

    const finalStr: string = `saved${indx.join('')}`

    switch (as)
    {
        case 'push':
            return finalStr

        case 'pull':
            return finalStr.split('.').slice(0, -2).join('.')

        default:
            return ''
    }
}


export default findUpdateString