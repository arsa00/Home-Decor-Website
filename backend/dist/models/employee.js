"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const schema = mongoose_1.default.Schema;
let Employee = new schema({
    agencyId: {
        type: mongoose_1.default.Types.ObjectId
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
    specialization: {
        type: String
    }
});
const EmployeeModel = mongoose_1.default.model("EmployeeModel", Employee, 'employees');
exports.EmployeeModel = EmployeeModel;
//# sourceMappingURL=employee.js.map