"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const StaticAuth = async (req, res, next) => {
    console.log('stat aut');
    next();
};
exports.default = StaticAuth;
