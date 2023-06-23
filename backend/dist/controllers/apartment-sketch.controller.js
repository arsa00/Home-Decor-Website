"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApartmentSketchController = void 0;
const apartment_sketch_1 = require("..//models/apartment-sketch");
// import mongoose from "mongoose";
const sanitaze = require('mongo-sanitize');
const mongoTypes = require('mongoose').Types;
class ApartmentSketchController {
    constructor() {
        this.addApartmentSketch = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const newApartmentSketch = new apartment_sketch_1.ApartmentSketchModel({
                roomSketches: sanitaze(req.body.roomSketches),
                firstRoomScreenUsage: sanitaze(req.body.firstRoomScreenUsage),
                type: sanitaze(req.body.type),
                address: sanitaze(req.body.address),
                squareFootage: sanitaze(req.body.squareFootage),
                ownerId: new mongoTypes.ObjectId(sanitaze(req.body.ownerId))
            });
            try {
                const savedAS = yield newApartmentSketch.save();
                return res.status(200).json(savedAS);
            }
            catch (err) {
                console.log(err);
                return res.status(500).json({ "errMsg": "Došlo je do greške. Pokušajte ponovo." });
            }
        });
        this.updateApartmentSketch = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const apartmentSketchId = new mongoTypes.ObjectId(sanitaze(req.body.apartmentSketchId));
            const roomSketches = sanitaze(req.body.roomSketches);
            const firstRoomScreenUsage = sanitaze(req.body.firstRoomScreenUsage);
            const type = sanitaze(req.body.type);
            const address = sanitaze(req.body.address);
            const squareFootage = sanitaze(req.body.squareFootage);
            let updateQuery;
            if (roomSketches)
                updateQuery = Object.assign(Object.assign({}, updateQuery), { "roomSketches": roomSketches });
            if (firstRoomScreenUsage)
                updateQuery = Object.assign(Object.assign({}, updateQuery), { "firstRoomScreenUsage": firstRoomScreenUsage });
            if (type)
                updateQuery = Object.assign(Object.assign({}, updateQuery), { "type": type });
            if (address)
                updateQuery = Object.assign(Object.assign({}, updateQuery), { "address": address });
            if (squareFootage)
                updateQuery = Object.assign(Object.assign({}, updateQuery), { "squareFootage": squareFootage });
            try {
                const apartmentSketchDb = yield apartment_sketch_1.ApartmentSketchModel.findOneAndUpdate({ "_id": apartmentSketchId }, updateQuery, { new: true }).orFail();
                return res.status(200).json(apartmentSketchDb);
            }
            catch (err) {
                console.log(err);
                return res.status(500).json({ "errMsg": "Došlo je do greške. Pokušajte ponovo." });
            }
        });
        this.deleteApartmentSketch = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const apartmentSketchId = new mongoTypes.ObjectId(sanitaze(req.body.apartmentSketchId));
            try {
                yield apartment_sketch_1.ApartmentSketchModel.deleteOne({ "_id": apartmentSketchId }).orFail();
                return res.status(200).json({ "succMsg": "Objekat uspešno obrisan." });
            }
            catch (err) {
                console.log(err);
                return res.status(500).json({ "errMsg": "Došlo je do greške. Pokušajte ponovo." });
            }
        });
        this.getAllOwnersApartmentSketches = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const ownerId = new mongoTypes.ObjectId(sanitaze(req.body.ownerId));
            try {
                const allApartmentSketches = yield apartment_sketch_1.ApartmentSketchModel.find({ "ownerId": ownerId }).orFail();
                return res.status(200).json(allApartmentSketches);
            }
            catch (err) {
                console.log(err);
                return res.status(500).json({ "errMsg": "Došlo je do greške. Pokušajte ponovo." });
            }
        });
    }
}
exports.ApartmentSketchController = ApartmentSketchController;
//# sourceMappingURL=apartment-sketch.controller.js.map