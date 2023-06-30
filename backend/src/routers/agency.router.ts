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

export default agencyRouter;