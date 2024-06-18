"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
class Server {
    //|***********|//
    //| CONSTANTS |//
    //|***********|//
    static MB = 1024 * 1024;
    static HOUR = 1000 * 60 * 60;
    static DAY = this.HOUR * 24;
    static WEEK = this.DAY * 7;
    static MONTH = this.DAY * 30;
    constructor() {
    }
    //|************|//
    //| VALIDATION |//
    //|************|//
    static validateUsername(username, min, max, errArr) {
        let error = null;
        if (!username)
            error = 'Username must be provided';
        else if (username.length < min || username.length > max)
            error = `Username must have ${min}-${max} characters`;
        else if (!/^[a-z0-9]+$/i.test(username))
            error = 'Username must be alphanumeric';
        errArr && error && errArr.push(error);
        return { success: !error, error };
    }
    static validatePassword(min, password, confirm, errArr) {
        let error = null;
        if (password.length < min)
            error = `Password must have minimum ${min} characters`;
        if (password !== confirm)
            error = `Passwords are different`;
        errArr && error && errArr.push(error);
        return { success: !error, error };
    }
    static validateMail(mail, errArr) {
        let error = null;
        if (!mail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/i.test(mail))
            error = 'Mail address is invalid';
        errArr && error && errArr.push(error);
        return { success: !error, error };
    }
    static async validateCaptcha(captcha, key, errArr) {
        let error = null;
        const res = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${key}&response=${captcha ?? 'x'}`, { method: 'POST' });
        const json = await res.json();
        if (!json?.success)
            error = 'Please solve captcha';
        errArr && error && errArr.push(error);
        return { success: !error, error };
    }
    //|*********|//
    //| HASHING |//
    //|*********|//
    static hash(key32bytesHex, text) {
        const salt = crypto_1.default.randomBytes(16), iv = crypto_1.default.randomBytes(16);
        const cipher = crypto_1.default.createCipheriv('aes-256-cbc', crypto_1.default.pbkdf2Sync(Buffer.from(key32bytesHex, 'hex'), salt, 10000, 32, 'sha256'), iv);
        return {
            salt: salt.toString('hex'),
            iv: iv.toString('hex'),
            hash: cipher.update(text, 'utf-8', 'hex') + cipher.final('hex')
        };
    }
    static verifyHash(key32bytesHex, encryptObj, text) {
        const decipher = crypto_1.default.createDecipheriv('aes-256-cbc', crypto_1.default.pbkdf2Sync(Buffer.from(key32bytesHex, 'hex'), Buffer.from(encryptObj.salt, 'hex'), 10000, 32, 'sha256'), Buffer.from(encryptObj.iv, 'hex'));
        return text === decipher.update(encryptObj.hash, 'hex', 'utf-8') + decipher.final('utf-8');
    }
    //|*******|//
    //| OTHER |//
    //|*******|//
    static async sleep(ms) {
        return new Promise(res => setTimeout(res, ms));
    }
    static getIP(req) {
        return req.headers['x-forwarded-for']?.[0] || req.socket.remoteAddress || null;
    }
}
exports.default = Server;
