import { Request, Response } from "express";
import { ApartmentSketchModel } from "..//models/apartment-sketch";
import { JobModel } from "../models/job";
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
            const apartmentSketchId = new mongoTypes.ObjectId(sanitaze(req.body.apartmentSketchId));
            const apartmentSketchDb = await ApartmentSketchModel.findOneAndUpdate({ "_id": apartmentSketchId }, updateQuery, { new: true }).orFail();
            
            // update referenced redundant data used for better query performance
            let objectJobUpdateQuery;

            if(type) objectJobUpdateQuery = { ...objectJobUpdateQuery, "objectType": type };
            if(address) objectJobUpdateQuery = { ...objectJobUpdateQuery, "objectAddress": address };

            await JobModel.updateMany({ "objectID": apartmentSketchId }, objectJobUpdateQuery);

            return res.status(200).json(apartmentSketchDb);
        } catch(err) {
            console.log(err);
            return res.status(500).json({"errMsg": "Došlo je do greške. Pokušajte ponovo."});
        }
    }


    deleteApartmentSketch = async (req: Request, res: Response) => {
        try {
            const apartmentSketchId = new mongoTypes.ObjectId(sanitaze(req.body.apartmentSketchId));
            await ApartmentSketchModel.deleteOne({ "_id": apartmentSketchId }).orFail();
            return res.status(200).json({ "succMsg": "Objekat uspešno obrisan." });
        } catch(err) {
            console.log(err);
            return res.status(500).json({"errMsg": "Došlo je do greške. Pokušajte ponovo."});
        }
    }


    getAllOwnersApartmentSketches = async (req: Request, res: Response) => {
        try {
            const ownerId = new mongoTypes.ObjectId(sanitaze(req.body.ownerId));
            const allApartmentSketches = await ApartmentSketchModel.find({ "ownerId": ownerId });
            return res.status(200).json(allApartmentSketches);
        } catch(err) {
            console.log(err);
            return res.status(500).json({"errMsg": "Došlo je do greške. Pokušajte ponovo."});
        }
    }


    getApartmentSketchByID = async (req: Request, res: Response) => {
        try {
            const apartmentSketchID = new mongoTypes.ObjectId(sanitaze(req.body.apartmentSketchID));
            const apartmentSketch = await ApartmentSketchModel.findOne({ "_id": apartmentSketchID }).orFail();
            return res.status(200).json(apartmentSketch);
        } catch(err) {
            console.log(err);
            return res.status(500).json({"errMsg": "Došlo je do greške. Pokušajte ponovo."});
        }
    }


    getMultipleApartmentSketchesByIds = async (req: Request, res: Response) => {
        try {
            let apartmentSketchIds: any[] = sanitaze(req.body.apartmentSketchIds);

            apartmentSketchIds = Array.from(apartmentSketchIds.map((val) => {
                return new mongoTypes.ObjectId(val);
            }));

            const apartmentSketches = await ApartmentSketchModel.find({ "_id": { "$in": apartmentSketchIds } });
            return res.status(200).json(apartmentSketches);
        } catch(err) {
            console.log(err);
            return res.status(500).json({"errMsg": "Došlo je do greške. Pokušajte ponovo."});
        }
    }


    updateRoomSketchProgress = async (req: Request, res: Response) => {
        try{
            const apartmentSketchId = new mongoTypes.ObjectId(sanitaze(req.body.apartmentSketchId));
            const roomSketchIndex = sanitaze(req.body.roomSketchIndex);
            const progress = sanitaze(req.body.progress);

            const apartmentSketchDb = await ApartmentSketchModel.findOneAndUpdate(
                { "_id": apartmentSketchId, "roomSketches.roomIndex": roomSketchIndex }, 
                { "$set" : { "roomSketches.$.progress":  progress} }, 
                { new: true }
            ).orFail();
            return res.status(200).json(apartmentSketchDb);
        } catch(err) {
            console.log(err);
            return res.status(500).json({"errMsg": "Došlo je do greške. Pokušajte ponovo."});
        }
    }

}