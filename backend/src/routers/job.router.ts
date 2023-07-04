import { Router } from "express";
import { JobController } from "../controllers/job.controller";

const jobRouter = Router();

jobRouter.route("/addJob").post(
    (req, res) => new JobController().addJob(req, res)
);


jobRouter.route("/updateJob").post(
    (req, res) => new JobController().updateJob(req, res)
);


jobRouter.route("/getAllClientJobs").post(
    (req, res) => new JobController().getAllClientJobs(req, res)
);


jobRouter.route("/getJobByID").post(
    (req, res) => new JobController().getJobByID(req, res)
);

export default jobRouter;