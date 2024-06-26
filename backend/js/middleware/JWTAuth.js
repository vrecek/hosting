"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const JWTAuth = async (req, res, next) => {
    const token = req.signedCookies?.token;
    try {
        if (!token)
            throw 1;
        const auth = jsonwebtoken_1.default.verify(token, process.env.JWTKEY);
        if (!auth)
            throw 1;
        const user = await User_1.default.exists({ _id: auth.id });
        if (!user)
            throw 1;
        req.id = auth.id;
        next();
    }
    catch (e) {
        req.id = undefined;
        return res.status(401).json({ msg: 'User not authenticated' });
    }
};
exports.default = JWTAuth;
