"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryFileItemById = void 0;
const queryFileItemById = (userId, itemId) => {
    return [
        {
            ownerID: userId,
            items: { $elemMatch: { _id: itemId } }
        },
        { 'items.$': 1 }
    ];
};
exports.queryFileItemById = queryFileItemById;
