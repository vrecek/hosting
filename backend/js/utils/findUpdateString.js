"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _nextFolder = (trees, item, arr) => {
    for (const [i, x] of Object.entries(item.items)) {
        if (trees.some(y => y === x.tree))
            arr.push(`.${i}.items`);
        if (x.itemtype === 'folder')
            _nextFolder(trees, x, arr);
    }
};
const findUpdateString = (tree, savedObj, as) => {
    const splt = tree.split('/'), trees = [tree, ...splt.map((_, i) => splt.slice(0, i).join('/')).slice(1)].toReversed(), indx = [];
    for (const [i, x] of Object.entries(savedObj)) {
        if (splt[0] === x.tree)
            indx.push(`.${i}.items`);
        _nextFolder(trees, x, indx);
    }
    const finalStr = `saved${indx.join('')}`;
    switch (as) {
        case 'push':
            return finalStr;
        case 'pull':
            return finalStr.split('.').slice(0, -2).join('.');
        default:
            return '';
    }
};
exports.default = findUpdateString;
