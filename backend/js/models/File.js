"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const fileSchema = new mongoose_1.default.Schema({
    ownerID: String,
    items: {
        type: [{
                secretName: String,
                thumbnail: { type: String, default: undefined }
            }],
        default: []
    }
});
exports.default = mongoose_1.default.model('File', fileSchema);
