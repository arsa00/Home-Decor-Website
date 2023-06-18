"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const schema = mongoose_1.default.Schema;
const ObjectId = mongoose_1.default.Types.ObjectId;
let Comment = new schema({
    agencyId: {
        type: ObjectId
    },
    comment: {
        type: String
    },
    grade: {
        type: Number
    },
    authorUsername: {
        type: String
    },
    authorFirstname: {
        type: String
    },
    authorLastname: {
        type: String
    },
    authorImgType: {
        type: String
    }
});
const CommentModel = mongoose_1.default.model("CommentModel", Comment, 'agency_comments');
exports.CommentModel = CommentModel;
//# sourceMappingURL=comment.js.map