"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _nextFolder = (searchTreeFor, item) => {
    if (item.tree === searchTreeFor)
        return item;
    for (const x of item.items.filter(y => y.itemtype === 'folder')) {
        const found = _nextFolder(searchTreeFor, x);
        if (found)
            return found;
    }
};
const findFolder = (searchTreeFor, savedObj) => {
    for (const folder of savedObj) {
        const found = _nextFolder(searchTreeFor, folder);
        if (found)
            return found;
    }
    return null;
};
exports.default = findFolder;
