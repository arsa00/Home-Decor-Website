"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const job_controller_1 = require("../controllers/job.controller");
const jobRouter = (0, express_1.Router)();
jobRouter.route("/addJob").post((req, res) => new job_controller_1.JobController().addJob(req, res));
jobRouter.route("/updateJob").post((req, res) => new job_controller_1.JobController().updateJob(req, res));
exports.default = jobRouter;
//# sourceMappingURL=job.router.js.map