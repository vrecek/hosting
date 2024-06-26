"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = __importDefault(require("fs/promises"));
const fsMkdir = async (path) => {
    try {
        await promises_1.default.access(path);
    }
    catch {
        await promises_1.default.mkdir(path);
    }
};
exports.default = fsMkdir;
