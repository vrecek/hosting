"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const findItem = (rootFolder, condition, __skip) => {
    if (!__skip && condition(rootFolder))
        return rootFolder;
    for (const item of rootFolder.items) {
        if (condition(item))
            return item;
        if (item.itemtype === 'folder') {
            const found = findItem(item, condition, true);
            if (found)
                return found;
        }
    }
};
exports.default = findItem;
