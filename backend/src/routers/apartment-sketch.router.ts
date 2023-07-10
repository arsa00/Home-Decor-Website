import { Router } from "express";
import { ApartmentSketchController } from "..//controllers/apartment-sketch.controller";
import { JwtAuth } from "../middlewares/jwt-auth";


const apartmentSketchRouter = Router();

apartmentSketchRouter.route("/addApartmentSketch").post(
    (req, res, next) => new JwtAuth().postValidateJwt(req, res, next),
    (req, res) => new ApartmentSketchController().addApartmentSketch(req, res)
);


apartmentSketchRouter.route("/updateApartmentSketch").post(
    (req, res, next) => new JwtAuth().postValidateJwt(req, res, next),
    (req, res) => new ApartmentSketchController().updateApartmentSketch(req, res)
);


apartmentSketchRouter.route("/deleteApartmentSketch").post(
    (req, res, next) => new JwtAuth().postValidateJwt(req, res, next),
    (req, res) => new ApartmentSketchController().deleteApartmentSketch(req, res)
);


apartmentSketchRouter.route("/getAllOwnersApartmentSketches").post(
    (req, res, next) => new JwtAuth().postValidateJwt(req, res, next),
    (req, res) => new ApartmentSketchController().getAllOwnersApartmentSketches(req, res)
);


apartmentSketchRouter.route("/getApartmentSketchByID").post(
    (req, res, next) => new JwtAuth().postValidateJwt(req, res, next),
    (req, res) => new ApartmentSketchController().getApartmentSketchByID(req, res)
);


apartmentSketchRouter.route("/getMultipleApartmentSketchesByIds").post(
    (req, res, next) => new JwtAuth().postValidateJwt(req, res, next),
    (req, res) => new ApartmentSketchController().getMultipleApartmentSketchesByIds(req, res)
);


apartmentSketchRouter.route("/updateRoomSketchProgress").post(
    (req, res, next) => new JwtAuth().postValidateJwt(req, res, next),
    (req, res) => new ApartmentSketchController().updateRoomSketchProgress(req, res)
);

export default apartmentSketchRouter;