"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgencyController = void 0;
const user_1 = require("../models/user");
const user_controller_1 = require("./user.controller");
const comment_1 = require("../models/comment");
const job_1 = require("../models/job");
const mongoSanitaze = require("mongo-sanitize");
const ObjectId = require("mongoose").Types.ObjectId;
class AgencyController {
    constructor() {
        this.getAgencies = (req, res) => {
            const searchTerm = mongoSanitaze(req.query.searchTerm);
            const searchName = mongoSanitaze(req.query.searchName) === "true" ? true : false;
            const searchAddress = mongoSanitaze(req.query.searchAddress) === "true" ? true : false;
            let filters = [];
            if (searchName) {
                filters.push({ "name": { "$regex": `.*${searchTerm}.*`, "$options": "i" } });
            }
            if (searchAddress) {
                filters.push({ "address": { "$regex": `.*${searchTerm}.*`, "$options": "i" } });
            }
            user_1.UserModel.find({
                "type": user_controller_1.UserController.AGENCY_TYPE,
                "$or": [
                    ...filters
                ]
            }, (err, agencies) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ errMsg: "Došlo je do greške. Pokušajte ponovo." });
                }
                return res.status(200).json(agencies);
            });
        };
        this.getAgency = (req, res) => {
            let agencyID;
            try {
                agencyID = new ObjectId(mongoSanitaze(req.query.agencyID));
            }
            catch (err) {
                console.log(err);
                return res.status(400).json({ errMsg: "Došlo je do greške. Pokušajte ponovo." });
            }
            user_1.UserModel.findOne({ "_id": agencyID }, (err, agency) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ errMsg: "Došlo je do greške. Pokušajte ponovo." });
                }
                return res.status(200).json(agency);
            });
        };
        this.getAllComments = (req, res) => {
            let agencyID;
            try {
                agencyID = new ObjectId(mongoSanitaze(req.query.agencyID));
            }
            catch (err) {
                console.log(err);
                return res.status(400).json({ errMsg: "Došlo je do greške. Pokušajte ponovo." });
            }
            comment_1.CommentModel.find({ "agencyId": agencyID }, (err, comments) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ errMsg: "Došlo je do greške. Pokušajte ponovo." });
                }
                return res.status(200).json(comments);
            });
        };
        this.getAllAnonymousComments = (req, res) => {
            let agencyID;
            try {
                agencyID = new ObjectId(mongoSanitaze(req.query.agencyID));
            }
            catch (err) {
                console.log(err);
                return res.status(400).json({ errMsg: "Došlo je do greške. Pokušajte ponovo." });
            }
            comment_1.CommentModel.find({ "agencyId": agencyID }, "-authorUsername -authorFirstname -authorLastname -authorImgType", (err, comments) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ errMsg: "Došlo je do greške. Pokušajte ponovo." });
                }
                return res.status(200).json(comments);
            });
        };
        this.getCommentByJobId = (req, res) => {
            let jobId;
            try {
                jobId = new ObjectId(mongoSanitaze(req.query.jobId));
            }
            catch (err) {
                console.log(err);
                return res.status(400).json({ errMsg: "Došlo je do greške. Pokušajte ponovo." });
            }
            comment_1.CommentModel.findOne({ "jobId": jobId }, (err, comment) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ errMsg: "Došlo je do greške. Pokušajte ponovo." });
                }
                return res.status(200).json(comment);
            });
        };
        this.addComment = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const jobId = new ObjectId(mongoSanitaze(req.body.jobId));
                const comment = mongoSanitaze(req.body.comment);
                const grade = mongoSanitaze(req.body.grade);
                const clientId = new ObjectId(mongoSanitaze(req.body.clientId));
                const job = yield job_1.JobModel.findOne({ "_id": jobId }).orFail();
                const author = yield user_1.UserModel.findOne({ "_id": job.clientID }).orFail();
                if (!author._id.equals(clientId))
                    throw Error(); // someone trying adding comment for job that isn't theirs
                const agency = yield user_1.UserModel.findOne({ "_id": job.agencyID }).orFail();
                const newComment = new comment_1.CommentModel({
                    agencyId: agency._id,
                    jobId: jobId,
                    comment: comment,
                    grade: grade,
                    authorFirstname: author.firstname,
                    authorLastname: author.lastname,
                    authorUsername: author.username,
                    authorImgType: author.imageType
                });
                const addedComment = yield newComment.save();
                return res.status(200).json(addedComment);
            }
            catch (err) {
                console.log(err);
                return res.status(500).json({ errMsg: "Došlo je do greške. Pokušajte ponovo." });
            }
        });
        this.updateComment = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const commentId = new ObjectId(mongoSanitaze(req.body.commentId));
                const comment = mongoSanitaze(req.body.comment);
                const grade = mongoSanitaze(req.body.grade);
                const clientUsername = mongoSanitaze(req.body.clientUsername); // for checkup
                let updateQuery;
                if (comment)
                    updateQuery = { "comment": comment };
                if (grade)
                    updateQuery = Object.assign(Object.assign({}, updateQuery), { "grade": grade });
                const newComment = yield comment_1.CommentModel.findOneAndUpdate({ "_id": commentId, "authorUsername": clientUsername }, updateQuery, { new: true }).orFail();
                return res.status(200).json(newComment);
            }
            catch (err) {
                console.log(err);
                return res.status(500).json({ errMsg: "Došlo je do greške. Pokušajte ponovo." });
            }
        });
    }
}
exports.AgencyController = AgencyController;
//# sourceMappingURL=agency.controller.js.map