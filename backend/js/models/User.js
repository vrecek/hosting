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
                        tree: String,
                        items: Array,
                        filetype: String,
                        created: Number,
                        sizeBytes: Number,
                        thumbnail: String,
                        length: Number,
                        note: String
                    }],
                name: String,
                itemtype: String,
                tree: String
            }],
        default: [{ name: 'root', itemtype: 'folder', tree: 'root', items: [] }]
    }
});
exports.default = mongoose_1.default.model('User', userSchema);
