"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const JWTAuth_1 = __importDefault(require("../middleware/JWTAuth"));
const File_1 = __importDefault(require("../models/File"));
const User_1 = __importDefault(require("../models/User"));
const findItem_1 = __importDefault(require("../utils/findItem"));
const Server_1 = __importDefault(require("../Server"));
const path_1 = __importDefault(require("path"));
const StaticAuth_1 = __importDefault(require("../middleware/StaticAuth"));
const findUpdateString_1 = __importDefault(require("../utils/findUpdateString"));
const mongoose_1 = __importDefault(require("mongoose"));
const queryUtils_1 = require("../utils/queryUtils");
const ItemRoute = express_1.default.Router();
ItemRoute.get('/:itemId', JWTAuth_1.default, async (req, res) => {
    const { itemId } = req.params;
    try {
        const [user, file] = await Promise.all([
            User_1.default.findOne({ _id: req.id })
                .select('saved')
                .lean(),
            File_1.default.findOne(...(0, queryUtils_1.queryFileItemById)(req.id, itemId)).lean()
        ]);
        const searchedFile = (0, findItem_1.default)(user.saved[0], (x) => {
            return x.itemtype !== 'folder' &&
                x._id.toString() === itemId;
        });
        if (!searchedFile || !file)
            return res.status(404).json({ msg: 'File not found' });
        const fileLoc = `${Server_1.default.getProtocolHost(req)}/files/${req.id}/${file.items[0].secretName}`;
        if (searchedFile.itemtype === 'file') {
            return res.json({
                ...searchedFile,
                itemURL: fileLoc
            });
        }
        return res.json({
            msg: true
        });
    }
    catch {
        res.status(500).json({ msg: 'Could not get the item' });
    }
});
ItemRoute.get('/download/:itemId', JWTAuth_1.default, StaticAuth_1.default, async (req, res) => {
    const { itemId } = req.params;
    try {
        const file = (await File_1.default.findOne(...(0, queryUtils_1.queryFileItemById)(req.id, itemId))
            .lean())?.items?.[0];
        if (!file)
            return res.status(404).json({ msg: 'File not found' });
        const filepath = path_1.default.join(__dirname, '..', '..', 'uploads', req.id, file.secretName);
        res.download(filepath, file.secretName);
    }
    catch {
        return res.status(500).json({ msg: 'Could not download the file' });
    }
});
ItemRoute.delete('/delete/:itemId', JWTAuth_1.default, async (req, res) => {
    const { itemId } = req.params;
    try {
        const [user, file] = await Promise.all([
            User_1.default.findOne({ _id: req.id })
                .select('saved')
                .lean(),
            File_1.default.findOne(...(0, queryUtils_1.queryFileItemById)(req.id, itemId)).lean()
        ]);
        const item = (0, findItem_1.default)(user.saved[0], (x) => {
            return x.itemtype !== 'folder' && x._id.toString() === itemId;
        });
        if (!file || !item)
            return res.status(404).json({ msg: 'File does not exist' });
        const delPath = (0, findUpdateString_1.default)(item.tree, user.saved, 'locFolder'), mongoID = new mongoose_1.default.Types.ObjectId(itemId);
        await Promise.all([
            File_1.default.updateOne({ ownerID: req.id }, { $pull: {
                    items: { _id: itemId }
                } }),
            User_1.default.updateOne({ _id: req.id }, { $pull: {
                    [delPath]: { _id: mongoID }
                } }),
            Server_1.default.rm([__dirname, '..', '..', 'uploads', req.id, `${file.items[0].secretName}*`], { fileRx: true })
        ]);
        res.json({ msg: 'Successfully deleted' });
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ msg: 'Could not delete the file' });
    }
});
exports.default = ItemRoute;
