"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const agency_controller_1 = require("../controllers/agency.controller");
const agencyRouter = (0, express_1.Router)();
agencyRouter.route("/getAgencies").get((req, res) => new agency_controller_1.AgencyController().getAgencies(req, res));
exports.default = agencyRouter;
//# sourceMappingURL=agency.router.js.map