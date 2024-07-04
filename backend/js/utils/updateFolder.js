"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _nextFolder = (item, protohost, userId) => {
    for (const x of item.items) {
        if (x.itemtype === 'movie') {
            const thumbnail = x.thumbnail;
            x.thumbnail = `${protohost}/files/${userId}/thumbnails/${thumbnail}`;
        }
        else if (x.itemtype === 'folder')
            _nextFolder(x, protohost, userId);
    }
};
const updateFolder = (savedObj, protohost, userId) => {
    for (const folder of savedObj)
        _nextFolder(folder, protohost, userId);
};
exports.default = updateFolder;
