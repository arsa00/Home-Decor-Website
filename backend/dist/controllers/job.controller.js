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
                agencyName: mongoSanitaze(req.body.agencyName),
                agencyOffer: mongoSanitaze(req.body.agencyOffer),
                cancelRequested: mongoSanitaze(req.body.cancelRequested),
                clientID: new ObjectId(mongoSanitaze(req.body.clientID)),
                endDate: mongoSanitaze(req.body.endDate),
                objectID: new ObjectId(mongoSanitaze(req.body.objectID)),
                objectType: mongoSanitaze(req.body.objectType),
                objectAddress: mongoSanitaze(req.body.objectAddress),
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
            const agencyName = mongoSanitaze(req.body.agencyName);
            const agencyOffer = mongoSanitaze(req.body.agencyOffer);
            const cancelRequested = mongoSanitaze(req.body.cancelRequested);
            const cancelReqMsg = mongoSanitaze(req.body.cancelReqMsg);
            const clientID = mongoSanitaze(req.body.clientID);
            const endDate = mongoSanitaze(req.body.endDate);
            const objectID = mongoSanitaze(req.body.objectID);
            const objectType = mongoSanitaze(req.body.objectType);
            const objectAddress = mongoSanitaze(req.body.objectAddress);
            const startDate = mongoSanitaze(req.body.startDate);
            let updateQuery;
            if (state)
                updateQuery = Object.assign(Object.assign({}, updateQuery), { "state": state });
            if (agencyID)
                updateQuery = Object.assign(Object.assign({}, updateQuery), { "agencyID": new ObjectId(agencyID) });
            if (agencyName)
                updateQuery = Object.assign(Object.assign({}, updateQuery), { "agencyName": new ObjectId(agencyName) });
            if (agencyOffer)
                updateQuery = Object.assign(Object.assign({}, updateQuery), { "agencyOffer": agencyOffer });
            if (cancelRequested)
                updateQuery = Object.assign(Object.assign({}, updateQuery), { "cancelRequested": cancelRequested });
            if (cancelReqMsg)
                updateQuery = Object.assign(Object.assign({}, updateQuery), { "cancelReqMsg": cancelReqMsg });
            if (clientID)
                updateQuery = Object.assign(Object.assign({}, updateQuery), { "clientID": new ObjectId(clientID) });
            if (endDate)
                updateQuery = Object.assign(Object.assign({}, updateQuery), { "endDate": endDate });
            if (objectID)
                updateQuery = Object.assign(Object.assign({}, updateQuery), { "objectID": new ObjectId(objectID) });
            if (objectType)
                updateQuery = Object.assign(Object.assign({}, updateQuery), { "objectType": objectType });
            if (objectAddress)
                updateQuery = Object.assign(Object.assign({}, updateQuery), { "objectAddress": objectAddress });
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
        this.getAllClientJobs = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const clientID = new ObjectId(mongoSanitaze(req.body.clientID));
            try {
                const allJobs = yield job_1.JobModel.find({ "clientID": clientID }).orFail();
                return res.status(200).json(allJobs);
            }
            catch (err) {
                console.log(err);
                return res.status(500).json({ "errMsg": "Došlo je do greške. Pokušajte ponovo." });
            }
        });
        this.getJobByID = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const jobID = new ObjectId(mongoSanitaze(req.body.jobID));
            try {
                const job = yield job_1.JobModel.findOne({ "_id": jobID }).orFail();
                return res.status(200).json(job);
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