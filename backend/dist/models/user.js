"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const schema = mongoose_1.default.Schema;
let User = new schema({
    username: {
        type: String
    },
    password: {
        type: String
    },
    type: {
        type: String
    },
    status: {
        type: String
    },
    firstname: {
        type: String
    },
    lastname: {
        type: String
    },
    phone: {
        type: String
    },
    mail: {
        type: String
    },
    name: {
        type: String
    },
    address: {
        type: String
    },
    idNumber: {
        type: String
    },
    description: {
        type: String
    },
    numOfOpenedPositions: {
        type: Number
    },
    numOfFilledPositions: {
        type: Number
    },
    imageType: {
        type: String
    },
    recoveryLink: {
        type: String
    },
    recoveryLinkTime: {
        type: Number
    }
});
const UserModel = mongoose_1.default.model("UserModel", User, 'user');
exports.UserModel = UserModel;
//# sourceMappingURL=user.js.map