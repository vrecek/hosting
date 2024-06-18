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
const dotenv = __importStar(require("dotenv"));
const path_1 = __importDefault(require("path"));
const mongoose_1 = __importDefault(require("mongoose"));
const UserRoute_1 = __importDefault(require("./routes/UserRoute"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
dotenv.config({ path: path_1.default.join(__dirname, '../', '.env') });
(async () => {
    console.log('Connecting...');
    const PORT = process.env.PORT, MONGO = process.env.MONGO, server = (0, express_1.default)();
    server.use(express_1.default.json());
    server.use(express_1.default.urlencoded({ extended: false }));
    server.use((0, cookie_parser_1.default)(process.env.COOKIEKEY));
    server.use('/filenode/api/user', UserRoute_1.default);
    try {
        await mongoose_1.default.connect(MONGO, { serverSelectionTimeoutMS: 10000 });
        server.listen(PORT, () => console.log(`Server started at port ${PORT}`));
    }
    catch (err) {
        console.log(`Could not start the server. Reason: ${err.toString()}`);
    }
})();
