"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _nextFolder = (searchFor, item) => {
    if (item.tree === searchFor)
        return item;
    for (const x of item.items.filter(y => y.itemtype === 'folder')) {
        const found = _nextFolder(searchFor, x);
        if (found)
            return found;
    }
};
const findFolder = (searchFor, savedObj) => {
    for (const folder of savedObj) {
        const found = _nextFolder(searchFor, folder);
        if (found)
            return found;
    }
    return null;
};
exports.default = findFolder;
