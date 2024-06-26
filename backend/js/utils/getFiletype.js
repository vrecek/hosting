"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvailableFileTypes = void 0;
const getFiletype = (fileext) => {
    switch (fileext) {
        case 'image/png':
        case 'image/jpg':
        case 'image/gif':
            return 'picture';
        case 'video/mp4':
            return 'video';
        case 'audio/mpeg':
            return 'music';
        case 'text/plain':
            return 'txt';
        case 'application/x-javascript':
        case 'application/x-shellscript':
        case 'text/x-python':
            return 'code';
        default: return 'other';
    }
};
exports.AvailableFileTypes = [
    'image/png', 'image/jpg', 'image/gif',
    'video/mp4',
    'audio/mpeg',
    'text/plain',
    'application/x-javascript', 'application/x-shellscript', 'text/x-python'
];
exports.default = getFiletype;
