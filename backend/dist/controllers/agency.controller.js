"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgencyController = void 0;
const user_1 = require("../models/user");
const user_controller_1 = require("./user.controller");
const mongoSanitaze = require("mongo-sanitize");
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
    }
}
exports.AgencyController = AgencyController;
//# sourceMappingURL=agency.controller.js.map