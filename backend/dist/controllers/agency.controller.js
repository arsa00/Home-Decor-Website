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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgencyController = void 0;
const user_1 = require("../models/user");
const user_controller_1 = require("./user.controller");
const comment_1 = require("../models/comment");
const job_1 = require("../models/job");
const employee_1 = require("../models/employee");
const mongoose_1 = __importDefault(require("mongoose"));
const agency_request_1 = require("../models/agency-request");
const mongoSanitaze = require("mongo-sanitize");
const ObjectId = mongoose_1.default.Types.ObjectId;
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
                return res.status(500).json({ "errMsg": "Došlo je do greške. Pokušajte ponovo." });
            }
        });
        this.addEmployee = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const agencyId = new ObjectId(mongoSanitaze(req.body.agencyId));
                const firstname = mongoSanitaze(req.body.employee.firstname);
                const lastname = mongoSanitaze(req.body.employee.lastname);
                const mail = mongoSanitaze(req.body.employee.mail);
                const phone = mongoSanitaze(req.body.employee.phone);
                const specialization = mongoSanitaze(req.body.employee.specialization);
                // check if there is enough opened positions at agency (throw err if not)
                let numOfEmployees = yield employee_1.EmployeeModel.find({ "agencyId": agencyId });
                yield user_1.UserModel.findOne({ "_id": agencyId, "numOfOpenedPositions": { "$gt": numOfEmployees.length } }).orFail();
                // checkup successful
                const newEmployee = new employee_1.EmployeeModel({
                    agencyId: agencyId,
                    firstname: firstname,
                    lastname: lastname,
                    mail: mail,
                    phone: phone,
                    specialization: specialization
                });
                const addedEmployee = yield newEmployee.save();
                return res.status(200).json(addedEmployee);
            }
            catch (err) {
                console.log(err);
                return res.status(500).json({ "errMsg": "Došlo je do greške. Pokušajte ponovo." });
            }
        });
        this.updateEmployee = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const agencyId = new ObjectId(mongoSanitaze(req.body.agencyId));
                const firstname = mongoSanitaze(req.body.employee.firstname);
                const lastname = mongoSanitaze(req.body.employee.lastname);
                const mail = mongoSanitaze(req.body.employee.mail);
                const phone = mongoSanitaze(req.body.employee.phone);
                const specialization = mongoSanitaze(req.body.employee.specialization);
                const employeeId = new ObjectId(mongoSanitaze(req.body.employee._id));
                const employeeAgencyId = new ObjectId(mongoSanitaze(req.body.employee.agencyId));
                if (!agencyId.equals(employeeAgencyId))
                    throw Error();
                let updateQuery;
                if (firstname)
                    updateQuery = { "firstname": firstname };
                if (lastname)
                    updateQuery = Object.assign(Object.assign({}, updateQuery), { "lastname": lastname });
                if (mail)
                    updateQuery = Object.assign(Object.assign({}, updateQuery), { "mail": mail });
                if (phone)
                    updateQuery = Object.assign(Object.assign({}, updateQuery), { "phone": phone });
                if (specialization)
                    updateQuery = Object.assign(Object.assign({}, updateQuery), { "specialization": specialization });
                const updatedEmployee = yield employee_1.EmployeeModel.findOneAndUpdate({ "_id": employeeId }, updateQuery, { new: true }).orFail();
                return res.status(200).json(updatedEmployee);
            }
            catch (err) {
                console.log(err);
                return res.status(500).json({ "errMsg": "Došlo je do greške. Pokušajte ponovo." });
            }
        });
        this.deleteEmployee = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const agencyId = new ObjectId(mongoSanitaze(req.body.agencyId));
                const employeeId = new ObjectId(mongoSanitaze(req.body.employeeId));
                yield employee_1.EmployeeModel.findOneAndDelete({ "_id": employeeId, "agencyId": agencyId }).orFail();
                return res.status(200).json({ "succMsg": "Radnik uspešno obirsan." });
            }
            catch (err) {
                console.log(err);
                return res.status(500).json({ "errMsg": "Došlo je do greške. Pokušajte ponovo." });
            }
        });
        this.getAllEmployeesForAgency = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const agencyId = new ObjectId(mongoSanitaze(req.body.agencyId));
                const allEmployees = yield employee_1.EmployeeModel.find({ "agencyId": agencyId });
                return res.status(200).json(allEmployees);
            }
            catch (err) {
                console.log(err);
                return res.status(500).json({ "errMsg": "Došlo je do greške. Pokušajte ponovo." });
            }
        });
        this.getAllAvailableEmployeesForAgency = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const agencyId = new ObjectId(mongoSanitaze(req.body.agencyId));
                // get all already assigned employees on active(=3) jobs
                const assignedEmployees = yield job_1.JobModel.find({ "agencyID": agencyId, "state": 3 }, { "assignedEmployees": 1, "_id": 0 });
                // create array of ids of already assigned employees 
                let assignedEmployeesId = [];
                for (let singleRow of assignedEmployees) {
                    for (let employee of singleRow.assignedEmployees) {
                        assignedEmployeesId.push(employee._id);
                    }
                }
                // find and return list of available employees
                const allEmployees = yield employee_1.EmployeeModel.find({ "agencyId": agencyId, "_id": { "$nin": assignedEmployeesId } });
                return res.status(200).json(allEmployees);
            }
            catch (err) {
                console.log(err);
                return res.status(500).json({ "errMsg": "Došlo je do greške. Pokušajte ponovo." });
            }
        });
        this.getNumOfOpenedPositions = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const agencyId = new ObjectId(mongoSanitaze(req.body.agencyId));
                const agency = yield user_1.UserModel.findOne({ "_id": agencyId }).orFail();
                return res.status(200).json({ "numOfOpenedPositions": agency.numOfOpenedPositions });
            }
            catch (err) {
                console.log(err);
                return res.status(500).json({ "errMsg": "Došlo je do greške. Pokušajte ponovo." });
            }
        });
        this.addNewAgencyRequest = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const agencyReq = mongoSanitaze(req.body.agencyReq);
                const newReq = new agency_request_1.AgencyRequestModel({
                    agencyId: agencyReq.agencyId,
                    type: agencyReq.type,
                    numOfPositions: agencyReq.numOfPositions
                });
                const addedReq = newReq.save();
                return res.status(200).json(addedReq);
            }
            catch (err) {
                console.log(err);
                return res.status(500).json({ "errMsg": "Došlo je do greške. Pokušajte ponovo." });
            }
        });
        this.getAllAgencyRequestsByAgencyId = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const agencyId = new ObjectId(mongoSanitaze(req.body.agencyId));
                const allRequests = yield agency_request_1.AgencyRequestModel.find({ "agencyId": agencyId });
                return res.status(200).json(allRequests);
            }
            catch (err) {
                console.log(err);
                return res.status(500).json({ "errMsg": "Došlo je do greške. Pokušajte ponovo." });
            }
        });
        this.acceptAgencyRequest = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const agencyRequestId = new ObjectId(mongoSanitaze(req.body.agencyRequestId));
                const agencyRequest = yield agency_request_1.AgencyRequestModel.findOneAndDelete({ "_id": agencyRequestId }).orFail();
                const oldAgency = yield user_1.UserModel.findOne({ "_id": agencyRequest.agencyId }).orFail();
                let oldNumOfOpenedPositions = 0;
                if (oldAgency.numOfOpenedPositions) {
                    oldNumOfOpenedPositions += oldAgency.numOfOpenedPositions;
                }
                const updatedAgency = yield user_1.UserModel.findOneAndUpdate({ "_id": agencyRequest.agencyId }, { "numOfOpenedPositions": oldNumOfOpenedPositions + agencyRequest.numOfPositions }, { new: true }).orFail();
                return res.status(200).json(updatedAgency);
            }
            catch (err) {
                console.log(err);
                return res.status(500).json({ "errMsg": "Došlo je do greške. Pokušajte ponovo." });
            }
        });
        this.rejectAgencyRequest = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const agencyRequestId = new ObjectId(mongoSanitaze(req.body.agencyRequestId));
                yield agency_request_1.AgencyRequestModel.findOneAndDelete({ "_id": agencyRequestId }).orFail();
                return res.status(200).json({ "succMsg": "Uspešno odbijen zahtev." });
            }
            catch (err) {
                console.log(err);
                return res.status(500).json({ "errMsg": "Došlo je do greške. Pokušajte ponovo." });
            }
        });
    }
}
exports.AgencyController = AgencyController;
//# sourceMappingURL=agency.controller.js.map