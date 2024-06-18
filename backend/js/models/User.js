"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    username: String,
    mail: String,
    password: {
        hash: String,
        salt: String,
        iv: String
    },
    saved: {
        type: [{
                items: [{
                        name: String,
                        itemtype: String,
                        filetype: String,
                        sizeKB: Number,
                        path: String,
                        thumbnail: String,
                        length: Number,
                        description: String
                    }],
                name: String,
                itemtype: String
            }],
        default: [{ name: 'root', itemtype: 'folder', items: [] }]
    }
});
exports.default = mongoose_1.default.model('User', userSchema);
