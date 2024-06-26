"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const ffmpeg_static_1 = __importDefault(require("ffmpeg-static"));
fluent_ffmpeg_1.default.setFfmpegPath(ffmpeg_static_1.default);
const ffprobe = async (file) => {
    return new Promise((res, rej) => {
        fluent_ffmpeg_1.default.ffprobe(file, (err, data) => {
            if (err)
                return rej(err);
            res(data.format);
        });
    });
};
exports.default = ffprobe;
