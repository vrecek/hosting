"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const findItem_1 = __importDefault(require("./findItem"));
const findFolder = (savedObj, searchTreeFor) => {
    return (0, findItem_1.default)(savedObj, (x) => {
        return x.itemtype === 'folder' &&
            x.tree === searchTreeFor;
    });
};
exports.default = findFolder;
