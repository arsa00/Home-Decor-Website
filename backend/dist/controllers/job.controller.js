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
const apartment_sketch_1 = require("../models/apartment-sketch");
const employee_1 = require("../models/employee");
const mongoSanitaze = require("mongo-sanitize");
const ObjectId = require("mongoose").Types.ObjectId;
class JobController {
    constructor() {
        this.addJob = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const objectID = new ObjectId(mongoSanitaze(req.body.objectID));
                // if object is already included within another job (that is not rejected, canceled nor finished), reject request
                const objectAlreadyUnderConstruction = yield job_1.JobModel.findOne({ "objectID": objectID, "state": { "$nin": [1, 4, 5] } });
                if (objectAlreadyUnderConstruction)
                    throw Error();
                // if object is not included within another job, 
                // reset progress of it's rooms before creating new job
                yield apartment_sketch_1.ApartmentSketchModel.findOneAndUpdate({ "_id": objectID }, { "$set": { "roomSketches.$[].progress": 1 } }, { multi: true }).orFail();
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
                    startDate: mongoSanitaze(req.body.startDate),
                    clientFirstname: mongoSanitaze(req.body.clientFirstname),
                    clientLastname: mongoSanitaze(req.body.clientLastname),
                    clientMail: mongoSanitaze(req.body.clientMail),
                    clientPhone: mongoSanitaze(req.body.clientPhone),
                    assignedEmployees: mongoSanitaze(req.body.assignedEmployees)
                });
                const addedJob = yield newJob.save();
                return res.status(200).json(addedJob);
            }
            catch (err) {
                console.log(err);
                return res.status(500).json({ "errMsg": "Došlo je do greške. Pokušajte ponovo." });
            }
        });
        this.updateJob = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
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
                const clientFirstname = mongoSanitaze(req.body.clientFirstname);
                const clientLastname = mongoSanitaze(req.body.clientLastname);
                const clientMail = mongoSanitaze(req.body.clientMail);
                const clientPhone = mongoSanitaze(req.body.clientPhone);
                const assignedEmployees = mongoSanitaze(req.body.assignedEmployees);
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
                if (clientFirstname)
                    updateQuery = Object.assign(Object.assign({}, updateQuery), { "clientFirstname": clientFirstname });
                if (clientLastname)
                    updateQuery = Object.assign(Object.assign({}, updateQuery), { "clientLastname": clientLastname });
                if (clientMail)
                    updateQuery = Object.assign(Object.assign({}, updateQuery), { "clientMail": clientMail });
                if (clientPhone)
                    updateQuery = Object.assign(Object.assign({}, updateQuery), { "clientPhone": clientPhone });
                if (assignedEmployees)
                    updateQuery = Object.assign(Object.assign({}, updateQuery), { "assignedEmployees": assignedEmployees });
                const jobID = new ObjectId(mongoSanitaze(req.body.jobID));
                const updatedJob = yield job_1.JobModel.findOneAndUpdate({ "_id": jobID }, updateQuery, { new: true }).orFail();
                return res.status(200).json(updatedJob);
            }
            catch (err) {
                console.log(err);
                return res.status(500).json({ "errMsg": "Došlo je do greške. Pokušajte ponovo." });
            }
        });
        this.getAllClientJobs = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const clientID = new ObjectId(mongoSanitaze(req.body.clientID));
                const allJobs = yield job_1.JobModel.find({ "clientID": clientID }).orFail();
                return res.status(200).json(allJobs);
            }
            catch (err) {
                console.log(err);
                return res.status(500).json({ "errMsg": "Došlo je do greške. Pokušajte ponovo." });
            }
        });
        this.getJobByID = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const jobID = new ObjectId(mongoSanitaze(req.body.jobID));
                const job = yield job_1.JobModel.findOne({ "_id": jobID }).orFail();
                return res.status(200).json(job);
            }
            catch (err) {
                console.log(err);
                return res.status(500).json({ "errMsg": "Došlo je do greške. Pokušajte ponovo." });
            }
        });
        this.deleteJob = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const jobID = new ObjectId(mongoSanitaze(req.body.jobID));
                yield job_1.JobModel.deleteOne({ "_id": jobID }).orFail();
                return res.status(200).json({ "errMsg": "Posao uspešno izbrisan." });
            }
            catch (err) {
                console.log(err);
                return res.status(500).json({ "errMsg": "Došlo je do greške. Pokušajte ponovo." });
            }
        });
        this.getAgencyJobsWithState = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const agencyId = new ObjectId(mongoSanitaze(req.body.agencyId));
                const jobState = mongoSanitaze(req.body.jobState);
                const allJobs = yield job_1.JobModel.find({ "agencyID": agencyId, "state": jobState });
                return res.status(200).json(allJobs);
            }
            catch (err) {
                console.log(err);
                return res.status(500).json({ "errMsg": "Došlo je do greške. Pokušajte ponovo." });
            }
        });
        this.assignEmployeesToJob = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const agencyId = new ObjectId(mongoSanitaze(req.body.agencyId));
                const jobId = new ObjectId(mongoSanitaze(req.body.jobId));
                const employees = mongoSanitaze(req.body.employees);
                if (!employees.length)
                    throw Error();
                // check if employees exist and are they working for agency with recevied agencyId
                const employeeIds = Array.from(employees.map((employee) => {
                    return employee._id;
                }));
                const employeesFromDb = yield employee_1.EmployeeModel.find({ "_id": { "$in": employeeIds }, "agencyId": agencyId }).orFail();
                if (employees.length != employeesFromDb.length)
                    throw Error();
                // assign them to job
                const updatedJob = yield job_1.JobModel.findOneAndUpdate({ "_id": jobId, "agencyID": agencyId }, { "$push": { "assignedEmployees": { "$each": employeesFromDb } } }, { new: true });
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