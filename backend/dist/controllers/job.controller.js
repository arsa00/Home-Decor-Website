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
exports.JobController = void 0;
const job_1 = require("../models/job");
const mongoSanitaze = require("mongo-sanitize");
const ObjectId = require("mongoose").Types.ObjectId;
class JobController {
    constructor() {
        this.addJob = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const newJob = new job_1.JobModel({
                state: mongoSanitaze(req.body.state),
                agencyID: new ObjectId(mongoSanitaze(req.body.agencyID)),
                agencyOffer: mongoSanitaze(req.body.agencyOffer),
                cancelRequested: mongoSanitaze(req.body.cancelRequested),
                clientID: new ObjectId(mongoSanitaze(req.body.clientID)),
                endDate: mongoSanitaze(req.body.endDate),
                objectID: new ObjectId(mongoSanitaze(req.body.objectID)),
                startDate: mongoSanitaze(req.body.startDate)
            });
            try {
                const addedJob = yield newJob.save();
                return res.status(200).json(addedJob);
            }
            catch (err) {
                console.log(err);
                return res.status(500).json({ "errMsg": "Došlo je do greške. Pokušajte ponovo." });
            }
        });
        this.updateJob = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const state = mongoSanitaze(req.body.state);
            const agencyID = mongoSanitaze(req.body.agencyID);
            const agencyOffer = mongoSanitaze(req.body.agencyOffer);
            const cancelRequested = mongoSanitaze(req.body.cancelRequested);
            const clientID = mongoSanitaze(req.body.clientID);
            const endDate = mongoSanitaze(req.body.endDate);
            const objectID = mongoSanitaze(req.body.objectID);
            const startDate = mongoSanitaze(req.body.startDate);
            let updateQuery;
            if (state)
                updateQuery = Object.assign(Object.assign({}, updateQuery), { "state": state });
            if (agencyID)
                updateQuery = Object.assign(Object.assign({}, updateQuery), { "agencyID": new ObjectId(agencyID) });
            if (agencyOffer)
                updateQuery = Object.assign(Object.assign({}, updateQuery), { "agencyOffer": agencyOffer });
            if (cancelRequested)
                updateQuery = Object.assign(Object.assign({}, updateQuery), { "cancelRequested": cancelRequested });
            if (clientID)
                updateQuery = Object.assign(Object.assign({}, updateQuery), { "clientID": new ObjectId(clientID) });
            if (endDate)
                updateQuery = Object.assign(Object.assign({}, updateQuery), { "endDate": endDate });
            if (objectID)
                updateQuery = Object.assign(Object.assign({}, updateQuery), { "objectID": new ObjectId(objectID) });
            if (startDate)
                updateQuery = Object.assign(Object.assign({}, updateQuery), { "startDate": startDate });
            const jobID = new ObjectId(mongoSanitaze(req.body.jobID));
            try {
                const updatedJob = yield job_1.JobModel.findOneAndUpdate({ "_id": jobID }, updateQuery, { new: true }).orFail();
                return res.status(200).json(updatedJob);
            }
            catch (err) {
                console.log(err);
                return res.status(500).json({ "errMsg": "Došlo je do greške. Pokušajte ponovo." });
            }
        });
    }
}
exports.JobController = JobController;
//# sourceMappingURL=job.controller.js.map