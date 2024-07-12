"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Server_1 = __importDefault(require("../Server"));
const rmAndRes = async (res, rmdest, msg, code) => {
    await Server_1.default.rm([rmdest]);
    return res.status(code ?? 400).json({ msg });
};
exports.default = rmAndRes;
