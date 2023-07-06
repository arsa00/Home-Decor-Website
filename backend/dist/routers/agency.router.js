"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const agency_controller_1 = require("../controllers/agency.controller");
const agencyRouter = (0, express_1.Router)();
agencyRouter.route("/getAgencies").get((req, res) => new agency_controller_1.AgencyController().getAgencies(req, res));
agencyRouter.route("/getAgency").get((req, res) => new agency_controller_1.AgencyController().getAgency(req, res));
agencyRouter.route("/getAllComments").get((req, res) => new agency_controller_1.AgencyController().getAllComments(req, res));
agencyRouter.route("/getAllAnonymousComments").get((req, res) => new agency_controller_1.AgencyController().getAllAnonymousComments(req, res));
agencyRouter.route("/getCommentByJobId").get((req, res) => new agency_controller_1.AgencyController().getCommentByJobId(req, res));
agencyRouter.route("/addComment").post((req, res) => new agency_controller_1.AgencyController().addComment(req, res));
agencyRouter.route("/updateComment").post((req, res) => new agency_controller_1.AgencyController().updateComment(req, res));
agencyRouter.route("/addEmployee").post((req, res) => new agency_controller_1.AgencyController().addEmployee(req, res));
agencyRouter.route("/updateEmployee").post((req, res) => new agency_controller_1.AgencyController().updateEmployee(req, res));
agencyRouter.route("/deleteEmployee").post((req, res) => new agency_controller_1.AgencyController().deleteEmployee(req, res));
agencyRouter.route("/getAllEmployeesForAgency").post((req, res) => new agency_controller_1.AgencyController().getAllEmployeesForAgency(req, res));
agencyRouter.route("/getNumOfOpenedPositions").post((req, res) => new agency_controller_1.AgencyController().getNumOfOpenedPositions(req, res));
exports.default = agencyRouter;
//# sourceMappingURL=agency.router.js.map