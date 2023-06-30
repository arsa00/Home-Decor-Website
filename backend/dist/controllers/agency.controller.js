"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgencyController = void 0;
const user_1 = require("../models/user");
const user_controller_1 = require("./user.controller");
const comment_1 = require("../models/comment");
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
            const agencyID = mongoSanitaze(req.query.agencyID);
            user_1.UserModel.findOne({ "_id": new ObjectId(agencyID) }, (err, agency) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ errMsg: "Došlo je do greške. Pokušajte ponovo." });
                }
                return res.status(200).json(agency);
            });
        };
        this.getAllComments = (req, res) => {
            const agencyID = mongoSanitaze(req.query.agencyID);
            comment_1.CommentModel.find({ "agencyId": new ObjectId(agencyID) }, (err, comments) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ errMsg: "Došlo je do greške. Pokušajte ponovo." });
                }
                return res.status(200).json(comments);
            });
        };
        this.getAllAnonymousComments = (req, res) => {
            const agencyID = mongoSanitaze(req.query.agencyID);
            comment_1.CommentModel.find({ "agencyId": new ObjectId(agencyID) }, "-authorUsername -authorFirstname -authorLastname -authorImgType", (err, comments) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ errMsg: "Došlo je do greške. Pokušajte ponovo." });
                }
                return res.status(200).json(comments);
            });
        };
    }
}
exports.AgencyController = AgencyController;
//# sourceMappingURL=agency.controller.js.map