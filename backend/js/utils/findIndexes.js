"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _nextFolder = (trees, item, arr) => {
    for (const [i, x] of Object.entries(item.items)) {
        if (trees.some(y => y === x.tree))
            arr.push(parseInt(i));
        if (x.itemtype === 'folder')
            _nextFolder(trees, x, arr);
    }
};
const findUpdateString = (tree, savedObj) => {
    const splt = tree.split('/'), trees = [tree, ...splt.map((_, i) => splt.slice(0, i).join('/')).slice(1)].toReversed(), indx = [];
    for (const folder of savedObj) {
        _nextFolder(trees, folder, indx);
    }
    console.log('INDEX');
    console.log(indx);
    // return indx
};
exports.default = findUpdateString;
