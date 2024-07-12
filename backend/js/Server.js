"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const multer_1 = __importDefault(require("multer"));
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
class Server {
    //|***********|//
    //| CONSTANTS |//
    //|***********|//
    static MiB = 2 ** 20;
    static GiB = 2 ** 30;
    static HOUR = 1000 * 60 * 60;
    static DAY = this.HOUR * 24;
    static WEEK = this.DAY * 7;
    static MONTH = this.DAY * 30;
    constructor() { }
    //|*************|//
    //| FILE UPLOAD |//
    //|*************|//
    static FileUpload = class {
        allowedExts;
        multerFileSize;
        multerMethod;
        constructor(allowedExts) {
            this.allowedExts = allowedExts;
            this.multerFileSize = 0;
            this.multerMethod = null;
        }
        returnMulterStorage(type, uploadPath, filenameFn) {
            if (type === 'memory')
                return multer_1.default.memoryStorage();
            if (type === 'disk' && uploadPath) {
                const storage = multer_1.default.diskStorage({
                    destination: (req, file, cb) => {
                        cb(null, uploadPath);
                    },
                    filename: (req, file, cb) => {
                        cb(null, filenameFn?.(file) ?? Server.getDateWithName(file.originalname));
                    }
                });
                return storage;
            }
            throw new Error('Got *disk* save type, but the *uploadPath* was not specified');
        }
        /**
            * @param type Either 'disk' or 'memory'
            * @param maxSizeKb maximum file size
            * @param fieldString FormData fieldname where the image/s is/are appended
            * @param uploadMethod Either 'array' or 'single'
            * @param uploadPath Path from where class JavaScript file is located, NOT where the method is executed. Optional if type === 'memory'
            * @info Make sure to include files to FormData or stop submitting function if they arent present (Client side form), or an error will be thrown
            * @info Make sure to create uploadPath directory if you want to use it
            * @returns Function that has Request, Response and callback with an error argument. Wrap your whole code in that callback to make it work
        */
        multerImageUpload(type, maxSizeKb, fieldString, uploadMethod, uploadPath, filenameFn) {
            const storage = this.returnMulterStorage(type, uploadPath, filenameFn);
            const fileFilter = (req, file, callback) => {
                if (this.allowedExts.some(x => x === file.mimetype))
                    return callback(null, true);
                const error = new Error();
                Object.assign(error, { code: 'WRONG_MIMETYPE' });
                callback(error);
            };
            const upload = (0, multer_1.default)({
                storage,
                limits: {
                    fileSize: maxSizeKb
                },
                fileFilter
            });
            this.multerFileSize = maxSizeKb;
            this.multerMethod = uploadMethod;
            if (uploadMethod === 'single')
                return upload.single(fieldString);
            else if (uploadMethod === 'array')
                return upload.array(fieldString);
            throw new Error('Incorrect upload method');
        }
        /**
            * @param err error from the multerImageUpload() callback argument
            * @returns Response with { msg } if error, null otherwise. Throw if present
        */
        multerImageUploadError(err, res, req) {
            if (err) {
                switch (err.code) {
                    case 'WRONG_MIMETYPE':
                        return res.status(400).json({ msg: 'Incorrect file mimetype' });
                    case 'LIMIT_FILE_SIZE':
                        const msg = `File's too large. Maximum size: ${Math.floor(this.multerFileSize / Server.MiB)}mb`;
                        return res.status(400).json({ msg });
                    default:
                        return res.status(500).json({ msg: 'Unkown error' });
                }
            }
            if ((this.multerMethod === 'single' && !req.file) ||
                (this.multerMethod === 'array' && !req.files?.length)) {
                return res.status(400).json({ msg: 'Image field is empty' });
            }
            return null;
        }
    };
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
    static sanitizedString(str, illegal, replaceChar) {
        const illegalChars = illegal ?? ['.', ',', '<', '>', ';', ':'];
        if (!replaceChar)
            return str ? illegalChars.some(x => str.includes(x)) : true;
        const rx = new RegExp(`[${illegalChars.join('')}]`, 'g');
        return str.replaceAll(rx, replaceChar);
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
    //| FILES |//
    //|*******|//
    static async mkdir(paths) {
        const pathname = path_1.default.join(...paths);
        try {
            await promises_1.default.access(pathname);
        }
        catch {
            await promises_1.default.mkdir(pathname);
        }
    }
    static async rm(paths, opts = defIRemoveOpts) {
        try {
            if (opts.fileRx) {
                const fileRx = new RegExp(paths.at(-1)), basename = path_1.default.join(...paths.slice(0, -1)), lsdir = await promises_1.default.readdir(basename);
                for (const file of lsdir)
                    if (fileRx.test(file)) {
                        await promises_1.default.rm(`${basename}/${file}`);
                        if (!opts.recursive)
                            return;
                    }
                return;
            }
            await promises_1.default.rm(path_1.default.join(...paths), { recursive: opts.recursive });
        }
        catch (e) {
            if (opts.throwErr)
                throw new Error(e);
            console.log(`Could not delete file: ${paths.join('/')}\nMessage: ${e}`);
        }
    }
    //|*******|//
    //| OTHER |//
    //|*******|//
    static async sleep(ms) {
        return new Promise(res => setTimeout(res, ms));
    }
    static getRandomID() {
        return Math.random().toString(16).slice(2);
    }
    static getDateWithName(name) {
        const da = new Date(Date.now());
        const date = `${da.getFullYear()}-${da.getMonth() + 1}-${da.getDate()}`, time = `${da.getHours()}-${da.getMinutes()}-${da.getSeconds()}`;
        return `${date}_${time}-${name}`;
    }
    static getIP(req) {
        return req.headers['x-forwarded-for']?.[0] || req.socket.remoteAddress || null;
    }
    static getProtocolHost(req) {
        return `${req.protocol}://${req.get('Host')}`;
    }
}
const defIRemoveOpts = { recursive: false, throwErr: false, fileRx: false };
exports.default = Server;
