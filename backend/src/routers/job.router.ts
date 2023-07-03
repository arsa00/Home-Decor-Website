import { Router } from "express";
import { JobController } from "../controllers/job.controller";

const jobRouter = Router();

jobRouter.route("/addJob").post(
    (req, res) => new JobController().addJob(req, res)
);


jobRouter.route("/updateJob").post(
    (req, res) => new JobController().updateJob(req, res)
);


export default jobRouter;