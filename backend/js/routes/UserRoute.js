"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Server_1 = __importDefault(require("../Server"));
const path_1 = __importDefault(require("path"));
const User_1 = __importDefault(require("../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWTAuth_1 = __importDefault(require("../middleware/JWTAuth"));
const findFolder_1 = __importDefault(require("../utils/findFolder"));
const findUpdateString_1 = __importDefault(require("../utils/findUpdateString"));
const getFiletype_1 = __importStar(require("../utils/getFiletype"));
const ffprobeFile_1 = __importDefault(require("../utils/ffprobeFile"));
const mongoose_1 = __importDefault(require("mongoose"));
const fsMkdir_1 = __importDefault(require("../utils/fsMkdir"));
const makeThumbnail_1 = __importDefault(require("../utils/makeThumbnail"));
const fs_1 = __importDefault(require("fs"));
const File_1 = __importDefault(require("../models/File"));
const loopFolders_1 = __importDefault(require("../utils/loopFolders"));
const UserRoute = express_1.default.Router();
UserRoute.get('/auth', JWTAuth_1.default, async (req, res) => {
    try {
        const user = await User_1.default.findById(req.id)
            .select('-password')
            .lean();
        if (user) {
            const protohost = Server_1.default.getProtocolHost(req);
            (0, loopFolders_1.default)(user.saved, (x) => {
                if (x.itemtype === 'movie') {
                    const thumbnail = x.thumbnail;
                    x.thumbnail = `${protohost}/files/${req.id}/thumbnails/${thumbnail}`;
                }
            });
        }
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
        const userID = new mongoose_1.default.Types.ObjectId().toString();
        const newUser = new User_1.default({
            _id: userID,
            username,
            mail,
            password: Server_1.default.hash(process.env.HASHKEY, password)
        });
        const newFile = new File_1.default({ ownerID: userID });
        await Promise.all([
            newUser.save(),
            newFile.save()
        ]);
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
        res.status(200).json({ msg: "Successfully logged in " });
    }
    catch {
        return res.status(500).json({ msg: 'Could not log in' });
    }
});
UserRoute.post('/logout', JWTAuth_1.default, (req, res) => {
    res.clearCookie('token');
    req.id = undefined;
    res.status(200).json({ msg: 'Logged out' });
});
// delete file if error
UserRoute.post('/new-file', JWTAuth_1.default, async (req, res) => {
    const user_uploads = path_1.default.join(__dirname, '..', '..', 'uploads', `${req.id}`), file_id = new mongoose_1.default.Types.ObjectId().toString();
    await (0, fsMkdir_1.default)(user_uploads);
    const fu = new Server_1.default.FileUpload(getFiletype_1.AvailableFileTypes);
    const up = fu.multerImageUpload('disk', Server_1.default.GiB, 'fileitem', 'single', user_uploads, (file) => `${file_id}${path_1.default.extname(file.originalname)}`);
    up(req, res, async (err) => {
        const error = fu.multerImageUploadError(err, res, req);
        if (error)
            return error;
        const { currentTree, filename, isMovie, movieDesc } = req.body, file = req.file;
        if (!currentTree || !filename)
            return res.status(400).json({ msg: 'Invalid body object' });
        try {
            const user = await User_1.default.findOne({ _id: req.id })
                .select('saved')
                .lean();
            if (Server_1.default.sanitizedString(filename))
                return res.status(400).json({ msg: 'Invalid file name' });
            if (!(0, findFolder_1.default)(currentTree, user.saved))
                return res.status(400).json({ msg: 'Folder does not exist' });
            const f_name = `${filename}${path_1.default.extname(file.originalname)}`, f_dest = `${file.destination}/${file.filename}`;
            let probe, itemObj, thumb_name = undefined, varObj = {};
            try {
                probe = await (0, ffprobeFile_1.default)(f_dest);
            }
            catch {
                return res.status(400).json({ msg: 'Could not probe the file' });
            }
            const objectID = new mongoose_1.default.Types.ObjectId().toString();
            const comObj = {
                _id: objectID,
                itemtype: isMovie ? 'movie' : 'file',
                tree: currentTree,
                sizeBytes: probe.size
            };
            if (isMovie) {
                const duration = Math.round(probe.duration), thumb_path = path_1.default.join(user_uploads, 'thumbnails');
                thumb_name = `${new mongoose_1.default.Types.ObjectId().toString()}.png`;
                await Promise.all([
                    Server_1.default.mkdir([thumb_path]),
                    (0, makeThumbnail_1.default)(f_dest, thumb_path, thumb_name, Math.floor(Math.random() * duration))
                ]);
                itemObj = {
                    ...comObj,
                    name: f_name.slice(0, f_name.lastIndexOf('.')),
                    description: movieDesc ?? '',
                    length: duration,
                    thumbnail: thumb_name
                };
                varObj = { movie: {
                        description: movieDesc,
                        thumbnail: `${Server_1.default.getProtocolHost(req)}/files/${req.id}/thumbnails/${thumb_name}`,
                        length: itemObj.length
                    } };
            }
            else {
                itemObj = {
                    ...comObj,
                    name: f_name,
                    filetype: (0, getFiletype_1.default)(file.mimetype)
                };
                varObj = { file: { filetype: (0, getFiletype_1.default)(file.mimetype) } };
            }
            const saveAt = (0, findUpdateString_1.default)(currentTree, user.saved, 'push');
            await Promise.all([
                User_1.default.updateOne({ _id: req.id }, { $push: {
                        [saveAt]: itemObj
                    } }),
                File_1.default.updateOne({ ownerID: req.id }, { $push: {
                        items: {
                            _id: objectID,
                            secretName: file.filename,
                            thumbnail: thumb_name
                        }
                    } })
            ]);
            res.status(201).json({
                msg: 'Successfully uploaded',
                _id: file_id,
                name: itemObj.name,
                ...varObj
            });
        }
        catch {
            res.status(500).json({ msg: 'Could not insert the file' });
        }
    });
});
UserRoute.patch('/new-folder', JWTAuth_1.default, async (req, res) => {
    const { foldername, atFolder } = req.body;
    if (Server_1.default.sanitizedString(foldername))
        return res.status(400).json({ msg: 'Invalid folder name' });
    if (!foldername || !atFolder)
        return res.status(400).json({ msg: 'Invalid body object' });
    try {
        const user = await User_1.default.findById(req.id)
            .select('saved')
            .lean();
        const target = (0, findFolder_1.default)(atFolder, user.saved);
        if (!target)
            return res.status(400).json({ msg: 'Folder does not exist' });
        if (target.items.some(x => x.name === foldername))
            return res.status(400).json({ msg: 'Folder already exists' });
        const newFolder = {
            items: [],
            itemtype: 'folder',
            name: foldername,
            tree: `${target.tree}/${foldername}`
        };
        const saveAt = (0, findUpdateString_1.default)(target.tree, user.saved, 'push');
        await User_1.default.updateOne({ _id: req.id }, { $push: {
                [saveAt]: newFolder
            } });
        res.status(201).json({ msg: 'Successfully created a new folder' });
    }
    catch {
        res.status(500).json({ msg: 'Could not create a directory' });
    }
});
UserRoute.delete('/delete-user', JWTAuth_1.default, async (req, res) => {
    try {
        await Promise.all([
            File_1.default.deleteOne({ ownerID: req.id }),
            User_1.default.deleteOne({ _id: req.id })
        ]);
        const userpath = path_1.default.join(__dirname, '..', '..', 'uploads', req.id);
        fs_1.default.rmSync(userpath, { recursive: true });
        res.clearCookie('token');
        req.id = undefined;
        res.status(200).json({ msg: 'Deleted account' });
    }
    catch {
        res.status(500).json({ msg: 'Could not delete the account' });
    }
});
UserRoute.delete('/delete-folder', JWTAuth_1.default, async (req, res) => {
    const { foldername, atFolder } = req.body;
    if (!foldername || !atFolder)
        return res.status(400).json({ msg: 'Invalid body object' });
    if (atFolder === 'root')
        return res.status(400).json({ msg: 'Cannot remove root directory' });
    try {
        const user = await User_1.default.findById(req.id)
            .select('saved')
            .lean();
        const target = (0, findFolder_1.default)(atFolder, user.saved), IDs = [];
        if (!target)
            return res.status(400).json({ msg: 'Folder does not exist' });
        (0, loopFolders_1.default)([target], (x) => {
            if (x.itemtype === 'file' || x.itemtype === 'movie')
                IDs.push(x._id);
        });
        const files = (await File_1.default.aggregate([
            { $match: { ownerID: req.id } },
            {
                $project: {
                    secretName: 1,
                    ownerID: 1,
                    items: {
                        $filter: {
                            input: '$items',
                            as: 'item',
                            cond: { $in: ['$$item._id', IDs.map(x => new mongoose_1.default.Types.ObjectId(x))] }
                        }
                    }
                }
            }
        ]))[0].items;
        const userPath = path_1.default.join(__dirname, '..', '..', 'uploads', req.id), delAt = (0, findUpdateString_1.default)(target.tree, user.saved, 'pull');
        for (const file of files) {
            await Server_1.default.rm([userPath, file.secretName]);
            if (file.thumbnail)
                await Server_1.default.rm([userPath, 'thumbnails', file.thumbnail]);
        }
        await Promise.all([
            User_1.default.updateOne({ _id: req.id }, { $pull: {
                    [delAt]: { name: foldername }
                } }),
            File_1.default.updateOne({ ownerID: req.id }, { $pull: {
                    items: { _id: { $in: IDs } }
                } })
        ]);
        res.status(200).json({ msg: 'Successfully deleted the folder' });
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ msg: 'Could not create a directory' });
    }
});
exports.default = UserRoute;
