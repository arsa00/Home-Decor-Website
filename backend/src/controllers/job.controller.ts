import { Request, Response } from "express";
import { JobModel } from "../models/job";


const mongoSanitaze = require("mongo-sanitize");
const ObjectId = require("mongoose").Types.ObjectId;

export class JobController {

    addJob = async (req: Request, res: Response) => {
        const newJob = new JobModel({
            state: mongoSanitaze(req.body.state),
            agencyID: new ObjectId(mongoSanitaze(req.body.agencyID)),
            agencyName: mongoSanitaze(req.body.agencyName),
            agencyOffer: mongoSanitaze(req.body.agencyOffer),
            cancelRequested: mongoSanitaze(req.body.cancelRequested),
            clientID: new ObjectId(mongoSanitaze(req.body.clientID)),
            endDate: mongoSanitaze(req.body.endDate),
            objectID: new ObjectId(mongoSanitaze(req.body.objectID)),
            objectType: mongoSanitaze(req.body.objectType),
            objectAddress: mongoSanitaze(req.body.objectAddress),
            startDate: mongoSanitaze(req.body.startDate)
        });

        try {
            const addedJob = await newJob.save();
            return res.status(200).json(addedJob);
        } catch(err) {
            console.log(err);
            return res.status(500).json({"errMsg": "Došlo je do greške. Pokušajte ponovo."});
        }
    }


    updateJob = async (req: Request, res: Response) => {
        const state = mongoSanitaze(req.body.state);
        const agencyID = mongoSanitaze(req.body.agencyID);
        const agencyName = mongoSanitaze(req.body.agencyName);
        const agencyOffer = mongoSanitaze(req.body.agencyOffer);
        const cancelRequested = mongoSanitaze(req.body.cancelRequested);
        const clientID = mongoSanitaze(req.body.clientID);
        const endDate = mongoSanitaze(req.body.endDate);
        const objectID = mongoSanitaze(req.body.objectID);
        const objectType = mongoSanitaze(req.body.objectType);
        const objectAddress = mongoSanitaze(req.body.objectAddress);
        const startDate = mongoSanitaze(req.body.startDate);

        let updateQuery;

        if(state) updateQuery = { ...updateQuery, "state": state };
        if(agencyID) updateQuery = { ...updateQuery, "agencyID": new ObjectId(agencyID) };
        if(agencyName) updateQuery = { ...updateQuery, "agencyName": new ObjectId(agencyName) };
        if(agencyOffer) updateQuery = { ...updateQuery, "agencyOffer": agencyOffer };
        if(cancelRequested) updateQuery = { ...updateQuery, "cancelRequested": cancelRequested };
        if(clientID) updateQuery = { ...updateQuery, "clientID": new ObjectId(clientID) };
        if(endDate) updateQuery = { ...updateQuery, "endDate": endDate };
        if(objectID) updateQuery = { ...updateQuery, "objectID": new ObjectId(objectID) };
        if(objectType) updateQuery = { ...updateQuery, "objectType": objectType };
        if(objectAddress) updateQuery = { ...updateQuery, "objectAddress": objectAddress };
        if(startDate) updateQuery = { ...updateQuery, "startDate": startDate };

        const jobID = new ObjectId(mongoSanitaze(req.body.jobID));

        try {
            const updatedJob = await JobModel.findOneAndUpdate({ "_id": jobID }, updateQuery, {new: true}).orFail();
            return res.status(200).json(updatedJob);
        } catch(err) {
            console.log(err);
            return res.status(500).json({"errMsg": "Došlo je do greške. Pokušajte ponovo."});
        }
    }


    getAllClientJobs = async (req: Request, res: Response) => {
        const clientID = new ObjectId(mongoSanitaze(req.body.clientID));

        try {
            const allJobs = await JobModel.find({ "clientID": clientID }).orFail();
            return res.status(200).json(allJobs);
        } catch(err) {
            console.log(err);
            return res.status(500).json({"errMsg": "Došlo je do greške. Pokušajte ponovo."});
        }
    }

}