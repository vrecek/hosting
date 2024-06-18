"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Server_1 = __importDefault(require("../Server"));
const User_1 = __importDefault(require("../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWTAuth_1 = __importDefault(require("../jwt/JWTAuth"));
const UserRoute = express_1.default.Router();
UserRoute.get('/auth', JWTAuth_1.default, async (req, res) => {
    try {
        const user = await User_1.default.findById(req.id)
            .select('-password')
            .lean();
        res.status(200).json(user);
    }
    catch {
        res.status(500).json({ msg: 'Could not authenticate the user' });
    }
});
UserRoute.post('/register', async (req, res) => {
    const { username, mail, password, confirm_password, checkbox, captcha } = req.body, errArr = [];
    Server_1.default.validateUsername(username, 3, 12, errArr);
    Server_1.default.validateMail(mail, errArr);
    Server_1.default.validatePassword(6, password, confirm_password, errArr);
    !checkbox && errArr.push('You must accept our ToS');
    await Server_1.default.validateCaptcha(captcha, process.env.CAPTCHA, errArr);
    if (errArr.length)
        return res.status(400).json({ msg: errArr[0] });
    try {
        const [doesUser, doesMail] = await Promise.all([
            User_1.default.exists({ username }),
            User_1.default.exists({ mail })
        ]);
        if (doesUser)
            return res.status(400).json({ msg: 'Username already exists' });
        if (doesMail)
            return res.status(400).json({ msg: 'Mail already exists' });
        const newUser = new User_1.default({
            username,
            mail,
            password: Server_1.default.hash(process.env.HASHKEY, password)
        });
        await newUser.save();
        res.status(201).json({ msg: 'Successfully created' });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: 'An error occured during creation of the user' });
    }
});
UserRoute.post('/signin', async (req, res) => {
    const { username, password, remember } = req.body;
    try {
        const user = await User_1.default.findOne({ username })
            .select('password')
            .lean();
        if (!user || !Server_1.default.verifyHash(process.env.HASHKEY, user.password, password))
            return res.status(400).json({ msg: 'Username or password is incorrect' });
        const expire = remember ? Server_1.default.MONTH : Server_1.default.HOUR;
        const token = jsonwebtoken_1.default.sign({ id: user._id.toString() }, process.env.JWTKEY, { expiresIn: expire, algorithm: 'HS256' });
        res.cookie('token', token, {
            signed: true,
            httpOnly: true,
            maxAge: expire
        });
    }
    catch {
        return res.status(500).json({ msg: 'Could not log in' });
    }
    res.status(200).json({ msg: "Successfully logged in " });
});
UserRoute.post('/logout', JWTAuth_1.default, (req, res) => {
    res.clearCookie('token');
    req.id = undefined;
    res.status(200).json({ msg: 'Logged out' });
});
UserRoute.delete('/delete', JWTAuth_1.default, async (req, res) => {
    try {
        if (!await User_1.default.exists({ _id: req.id }))
            return res.status(400).json({ msg: 'Account does not exist' });
        await User_1.default.deleteOne({ _id: req.id });
        res.clearCookie('token');
        req.id = undefined;
        res.status(200).json({ msg: 'Deleted account' });
    }
    catch {
        res.status(500).json({ msg: 'Could not delete the account' });
    }
});
exports.default = UserRoute;
