import { Router } from "express";
import { AgencyController } from "../controllers/agency.controller";


const agencyRouter = Router();

agencyRouter.route("/getAgencies").get(
    (req, res) => new AgencyController().getAgencies(req, res)
);


agencyRouter.route("/getAgency").get(
    (req, res) => new AgencyController().getAgency(req, res)
);


agencyRouter.route("/getAllComments").get(
    (req, res) => new AgencyController().getAllComments(req, res)
);


agencyRouter.route("/getAllAnonymousComments").get(
    (req, res) => new AgencyController().getAllAnonymousComments(req, res)
);


agencyRouter.route("/getCommentByJobId").get(
    (req, res) => new AgencyController().getCommentByJobId(req, res)
);


agencyRouter.route("/addComment").post(
    (req, res) => new AgencyController().addComment(req, res)
);


agencyRouter.route("/updateComment").post(
    (req, res) => new AgencyController().updateComment(req, res)
);


agencyRouter.route("/addEmployee").post(
    (req, res) => new AgencyController().addEmployee(req, res)
);


agencyRouter.route("/updateEmployee").post(
    (req, res) => new AgencyController().updateEmployee(req, res)
);


agencyRouter.route("/deleteEmployee").post(
    (req, res) => new AgencyController().deleteEmployee(req, res)
);


agencyRouter.route("/getAllEmployeesForAgency").post(
    (req, res) => new AgencyController().getAllEmployeesForAgency(req, res)
);


agencyRouter.route("/getAllAvailableEmployeesForAgency").post(
    (req, res) => new AgencyController().getAllAvailableEmployeesForAgency(req, res)
);


agencyRouter.route("/getNumOfOpenedPositions").post(
    (req, res) => new AgencyController().getNumOfOpenedPositions(req, res)
);


agencyRouter.route("/addNewAgencyRequest").post(
    (req, res) => new AgencyController().addNewAgencyRequest(req, res)
);


agencyRouter.route("/getAllAgencyRequestsByAgencyId").post(
    (req, res) => new AgencyController().getAllAgencyRequestsByAgencyId(req, res)
);


agencyRouter.route("/acceptAgencyRequest").post(
    (req, res) => new AgencyController().acceptAgencyRequest(req, res)
);


agencyRouter.route("/rejectAgencyRequest").post(
    (req, res) => new AgencyController().rejectAgencyRequest(req, res)
);

export default agencyRouter;