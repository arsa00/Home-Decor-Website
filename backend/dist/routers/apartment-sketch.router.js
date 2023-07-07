"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const apartment_sketch_controller_1 = require("..//controllers/apartment-sketch.controller");
const apartmentSketchRouter = (0, express_1.Router)();
apartmentSketchRouter.route("/addApartmentSketch").post((req, res) => new apartment_sketch_controller_1.ApartmentSketchController().addApartmentSketch(req, res));
apartmentSketchRouter.route("/updateApartmentSketch").post((req, res) => new apartment_sketch_controller_1.ApartmentSketchController().updateApartmentSketch(req, res));
apartmentSketchRouter.route("/deleteApartmentSketch").post((req, res) => new apartment_sketch_controller_1.ApartmentSketchController().deleteApartmentSketch(req, res));
apartmentSketchRouter.route("/getAllOwnersApartmentSketches").post((req, res) => new apartment_sketch_controller_1.ApartmentSketchController().getAllOwnersApartmentSketches(req, res));
apartmentSketchRouter.route("/getApartmentSketchByID").post((req, res) => new apartment_sketch_controller_1.ApartmentSketchController().getApartmentSketchByID(req, res));
apartmentSketchRouter.route("/getMultipleApartmentSketchesByIds").post((req, res) => new apartment_sketch_controller_1.ApartmentSketchController().getMultipleApartmentSketchesByIds(req, res));
exports.default = apartmentSketchRouter;
//# sourceMappingURL=apartment-sketch.router.js.map