"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const schema = mongoose_1.default.Schema;
const ObjectId = mongoose_1.default.Types.ObjectId;
let Job = new schema({
    state: {
        type: Number
    },
    clientID: {
        type: ObjectId
    },
    agencyID: {
        type: ObjectId
    },
    agencyName: {
        type: String
    },
    objectID: {
        type: ObjectId
    },
    objectType: {
        type: String
    },
    objectAddress: {
        type: String
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    agencyOffer: {
        type: Number
    },
    cancelRequested: {
        type: Boolean
    },
    cancelReqMsg: {
        type: String
    },
    clientFirstname: {
        type: String
    },
    clientLastname: {
        type: String
    },
    clientPhone: {
        type: String
    },
    clientMail: {
        type: String
    },
    assignedEmployees: {
        type: Array
    }
});
const JobModel = mongoose_1.default.model("JobModel", Job, "job");
exports.JobModel = JobModel;
//# sourceMappingURL=job.js.map