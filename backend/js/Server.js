"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Server {
    constructor() {
    }
    static async sleep(ms) {
        return new Promise(res => setTimeout(res, ms));
    }
}
exports.default = Server;
