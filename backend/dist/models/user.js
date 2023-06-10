"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModel = exports.AgencyModel = exports.ClientModel = exports.UserModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const schema = mongoose_1.default.Schema;
let Client = new schema({
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
    }
});
let Agency = new schema({
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
    name: {
        type: String
    },
    address: {
        type: String
    },
    idNumber: {
        type: String
    },
    phone: {
        type: String
    },
    mail: {
        type: String
    },
    description: {
        type: String
    }
});
let Admin = new schema({
    username: {
        type: String
    },
    password: {
        type: String
    },
    type: {
        type: String
    },
    firstname: {
        type: String
    },
    lastname: {
        type: String
    },
    mail: {
        type: String
    }
});
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
    }
});
let UserModel = mongoose_1.default.model("UserModel", User, 'user');
exports.UserModel = UserModel;
let ClientModel = mongoose_1.default.model("ClientModel", Client, 'user');
exports.ClientModel = ClientModel;
let AgencyModel = mongoose_1.default.model("AgencyModel", Agency, 'user');
exports.AgencyModel = AgencyModel;
let AdminModel = mongoose_1.default.model("AdminModel", Admin, 'user');
exports.AdminModel = AdminModel;
//# sourceMappingURL=user.js.map