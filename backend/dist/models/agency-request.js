"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgencyRequestModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const schema = mongoose_1.default.Schema;
let AgencyRequest = new schema({
    agencyId: {
        type: mongoose_1.default.Types.ObjectId
    },
    type: {
        type: Number
    },
    numOfPositions: {
        type: Number
    }
});
const AgencyRequestModel = mongoose_1.default.model("AgencyRequestModel", AgencyRequest, 'agency_request');
exports.AgencyRequestModel = AgencyRequestModel;
//# sourceMappingURL=agency-request.js.map