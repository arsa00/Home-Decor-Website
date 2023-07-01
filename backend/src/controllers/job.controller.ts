import { Request, Response } from "express";
import { JobModel } from "../models/job";


const mongoSanitaze = require("mongo-sanitize");
const ObjectId = require("mongoose").Types.ObjectId;

export class JobController {

    addJob = async (req: Request, res: Response) => {
        const newJob = new JobModel({
            state: mongoSanitaze(req.body.state),
            agencyID: mongoSanitaze(req.body.agencyID),
            agencyOffer: mongoSanitaze(req.body.agencyOffer),
            cancelRequested: mongoSanitaze(req.body.cancelRequested),
            clientID: mongoSanitaze(req.body.clientID),
            endDate: mongoSanitaze(req.body.endDate),
            objectID: mongoSanitaze(req.body.objectID),
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
        const updateQuery = {
            state: mongoSanitaze(req.body.state),
            agencyID: mongoSanitaze(req.body.agencyID),
            agencyOffer: mongoSanitaze(req.body.agencyOffer),
            cancelRequested: mongoSanitaze(req.body.cancelRequested),
            clientID: mongoSanitaze(req.body.clientID),
            endDate: mongoSanitaze(req.body.endDate),
            objectID: mongoSanitaze(req.body.objectID),
            startDate: mongoSanitaze(req.body.startDate)
        };

        const jobID = mongoSanitaze(req.body.jobID);

        try {
            const updatedJob = await JobModel.findOneAndUpdate({ "_id": jobID }, updateQuery, {new: true}).orFail();
            return res.status(200).json(updatedJob);
        } catch(err) {
            console.log(err);
            return res.status(500).json({"errMsg": "Došlo je do greške. Pokušajte ponovo."});
        }
    }

}