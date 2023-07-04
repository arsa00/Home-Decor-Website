import { Request, Response } from "express";
import { ApartmentSketchModel } from "..//models/apartment-sketch";
// import mongoose from "mongoose";

const sanitaze = require('mongo-sanitize');
const mongoTypes = require('mongoose').Types;

export class ApartmentSketchController {

    addApartmentSketch = async (req: Request, res: Response) => {

        const newApartmentSketch = new ApartmentSketchModel({
            roomSketches: sanitaze(req.body.roomSketches),
            firstRoomScreenUsage: sanitaze(req.body.firstRoomScreenUsage),
            type: sanitaze(req.body.type),
            address: sanitaze(req.body.address),
            squareFootage: sanitaze(req.body.squareFootage),
            ownerId: new mongoTypes.ObjectId(sanitaze(req.body.ownerId))
        });

        try {
            const savedAS = await newApartmentSketch.save();
            return res.status(200).json(savedAS);
        } catch(err) {
            console.log(err);
            return res.status(500).json({"errMsg": "Došlo je do greške. Pokušajte ponovo."});
        }
    }


    updateApartmentSketch = async (req: Request, res: Response) => {
        const apartmentSketchId = new mongoTypes.ObjectId(sanitaze(req.body.apartmentSketchId));
        const roomSketches = sanitaze(req.body.roomSketches);
        const firstRoomScreenUsage = sanitaze(req.body.firstRoomScreenUsage);
        const type = sanitaze(req.body.type);
        const address = sanitaze(req.body.address);
        const squareFootage = sanitaze(req.body.squareFootage);
        

        let updateQuery;

        if(roomSketches) updateQuery = { ...updateQuery, "roomSketches": roomSketches };
        if(firstRoomScreenUsage) updateQuery = { ...updateQuery, "firstRoomScreenUsage": firstRoomScreenUsage };
        if(type) updateQuery = { ...updateQuery, "type": type };
        if(address) updateQuery = { ...updateQuery, "address": address };
        if(squareFootage) updateQuery = { ...updateQuery, "squareFootage": squareFootage };


        try{
            const apartmentSketchDb = await ApartmentSketchModel.findOneAndUpdate({ "_id": apartmentSketchId }, updateQuery, { new: true }).orFail();
            return res.status(200).json(apartmentSketchDb);
        } catch(err) {
            console.log(err);
            return res.status(500).json({"errMsg": "Došlo je do greške. Pokušajte ponovo."});
        }
    }


    deleteApartmentSketch = async (req: Request, res: Response) => {
        const apartmentSketchId = new mongoTypes.ObjectId(sanitaze(req.body.apartmentSketchId));

        try {
            await ApartmentSketchModel.deleteOne({ "_id": apartmentSketchId }).orFail();
            return res.status(200).json({ "succMsg": "Objekat uspešno obrisan." });
        } catch(err) {
            console.log(err);
            return res.status(500).json({"errMsg": "Došlo je do greške. Pokušajte ponovo."});
        }
    }


    getAllOwnersApartmentSketches = async (req: Request, res: Response) => {
        const ownerId = new mongoTypes.ObjectId(sanitaze(req.body.ownerId));

        try {
            const allApartmentSketches = await ApartmentSketchModel.find({ "ownerId": ownerId }).orFail();
            return res.status(200).json(allApartmentSketches);
        } catch(err) {
            console.log(err);
            return res.status(500).json({"errMsg": "Došlo je do greške. Pokušajte ponovo."});
        }
    }


    getApartmentSketchByID = async (req: Request, res: Response) => {
        const apartmentSketchID = new mongoTypes.ObjectId(sanitaze(req.body.apartmentSketchID));

        try {
            const apartmentSketch = await ApartmentSketchModel.findOne({ "_id": apartmentSketchID }).orFail();
            return res.status(200).json(apartmentSketch);
        } catch(err) {
            console.log(err);
            return res.status(500).json({"errMsg": "Došlo je do greške. Pokušajte ponovo."});
        }
    }

}