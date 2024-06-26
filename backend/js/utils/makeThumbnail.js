"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const makeThumbnail = async (dest, thumb_path, thumb_name, ts) => {
    return new Promise((res, rej) => {
        (0, fluent_ffmpeg_1.default)(dest).screenshots({
            count: 1,
            folder: thumb_path,
            timestamps: [ts],
            filename: thumb_name,
            size: '640x480'
        })
            .on('end', res)
            .on('error', rej);
    });
};
exports.default = makeThumbnail;
