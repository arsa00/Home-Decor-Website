import { Router } from "express";
import { JobController } from "../controllers/job.controller";
import { JwtAuth } from "../middlewares/jwt-auth";

const jobRouter = Router();

jobRouter.route("/addJob").post(
    (req, res, next) => new JwtAuth().postValidateJwt(req, res, next),
    (req, res) => new JobController().addJob(req, res)
);


jobRouter.route("/updateJob").post(
    (req, res, next) => new JwtAuth().postValidateJwt(req, res, next),
    (req, res) => new JobController().updateJob(req, res)
);


jobRouter.route("/getAllClientJobs").post(
    (req, res, next) => new JwtAuth().postValidateJwt(req, res, next),
    (req, res) => new JobController().getAllClientJobs(req, res)
);


jobRouter.route("/getJobByID").post(
    (req, res, next) => new JwtAuth().postValidateJwt(req, res, next),
    (req, res) => new JobController().getJobByID(req, res)
);


jobRouter.route("/deleteJob").post(
    (req, res, next) => new JwtAuth().postValidateJwt(req, res, next),
    (req, res) => new JobController().deleteJob(req, res)
);


jobRouter.route("/getAgencyJobsWithState").post(
    (req, res, next) => new JwtAuth().postValidateJwt(req, res, next),
    (req, res) => new JobController().getAgencyJobsWithState(req, res)
);


jobRouter.route("/assignEmployeesToJob").post(
    (req, res, next) => new JwtAuth().postValidateJwt(req, res, next),
    (req, res) => new JobController().assignEmployeesToJob(req, res)
);


jobRouter.route("/getNumberOfJobs").post(
    (req, res, next) => new JwtAuth().postValidateJwt(req, res, next),
    (req, res) => new JobController().getNumberOfJobs(req, res)
);


jobRouter.route("/getNumberOfJobCancelRequests").post(
    (req, res, next) => new JwtAuth().postValidateJwt(req, res, next),
    (req, res) => new JobController().getNumberOfJobCancelRequests(req, res)
);


jobRouter.route("/getSliceOfJobs").post(
    (req, res, next) => new JwtAuth().postValidateJwt(req, res, next),
    (req, res) => new JobController().getSliceOfJobs(req, res)
);


jobRouter.route("/getSliceOfJobCancelRequests").post(
    (req, res, next) => new JwtAuth().postValidateJwt(req, res, next),
    (req, res) => new JobController().getSliceOfJobCancelRequests(req, res)
);


jobRouter.route("/acceptJobCancelRequest").post(
    (req, res, next) => new JwtAuth().postValidateJwt(req, res, next),
    (req, res) => new JobController().acceptJobCancelRequest(req, res)
);


jobRouter.route("/rejectJobCancelRequest").post(
    (req, res, next) => new JwtAuth().postValidateJwt(req, res, next),
    (req, res) => new JobController().rejectJobCancelRequest(req, res)
);


jobRouter.route("/receiveRejectedJobCancelRequest").post(
    (req, res, next) => new JwtAuth().postValidateJwt(req, res, next),
    (req, res) => new JobController().receiveRejectedJobCancelRequest(req, res)
);

export default jobRouter;