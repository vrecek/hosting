"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const loopFolders = (savedObj, fn) => {
    const _nextFolder = (item) => {
        for (const x of item.items) {
            fn(x);
            if (x.itemtype === 'folder')
                _nextFolder(x);
        }
    };
    for (const folder of savedObj)
        _nextFolder(folder);
};
exports.default = loopFolders;
