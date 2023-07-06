import { Request, Response } from "express";
import { JobModel } from "../models/job";
import { ApartmentSketchModel } from "../models/apartment-sketch";


const mongoSanitaze = require("mongo-sanitize");
const ObjectId = require("mongoose").Types.ObjectId;

export class JobController {

    addJob = async (req: Request, res: Response) => {
        try {
            const objectID = new ObjectId(mongoSanitaze(req.body.objectID));

            // if object is already included within another job (that is not rejected, canceled nor finished), reject request
            const objectAlreadyUnderConstruction = await JobModel.findOne(
                { "objectID": objectID, "state": { "$nin": [ 1, 4, 5 ] } }
            );

            if(objectAlreadyUnderConstruction) throw Error();

            // if object is not included within another job, 
            // reset progress of it's rooms before creating new job
            await ApartmentSketchModel.findOneAndUpdate(
                { "_id": objectID }, 
                { "$set": { "roomSketches.$[].progress": 1 } },
                { multi: true }
            ).orFail();

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
                startDate: mongoSanitaze(req.body.startDate),
                clientFirstname : mongoSanitaze(req.body.clientFirstname),
                clientLastname: mongoSanitaze(req.body.clientLastname),
                clientMail: mongoSanitaze(req.body.clientMail),
                clientPhone: mongoSanitaze(req.body.clientPhone),
                assignedEmployees: mongoSanitaze(req.body.assignedEmployees)
            });

            const addedJob = await newJob.save();
            return res.status(200).json(addedJob);
        } catch(err) {
            console.log(err);
            return res.status(500).json({"errMsg": "Došlo je do greške. Pokušajte ponovo."});
        }
    }


    updateJob = async (req: Request, res: Response) => {
        try {
            const state = mongoSanitaze(req.body.state);
            const agencyID = mongoSanitaze(req.body.agencyID);
            const agencyName = mongoSanitaze(req.body.agencyName);
            const agencyOffer = mongoSanitaze(req.body.agencyOffer);
            const cancelRequested = mongoSanitaze(req.body.cancelRequested);
            const cancelReqMsg = mongoSanitaze(req.body.cancelReqMsg);
            const clientID = mongoSanitaze(req.body.clientID);
            const endDate = mongoSanitaze(req.body.endDate);
            const objectID = mongoSanitaze(req.body.objectID);
            const objectType = mongoSanitaze(req.body.objectType);
            const objectAddress = mongoSanitaze(req.body.objectAddress);
            const startDate = mongoSanitaze(req.body.startDate);
            const clientFirstname = mongoSanitaze(req.body.clientFirstname);
            const clientLastname = mongoSanitaze(req.body.clientLastname);
            const clientMail = mongoSanitaze(req.body.clientMail);
            const clientPhone = mongoSanitaze(req.body.clientPhone);
            const assignedEmployees = mongoSanitaze(req.body.assignedEmployees);

            let updateQuery;

            if(state) updateQuery = { ...updateQuery, "state": state };
            if(agencyID) updateQuery = { ...updateQuery, "agencyID": new ObjectId(agencyID) };
            if(agencyName) updateQuery = { ...updateQuery, "agencyName": new ObjectId(agencyName) };
            if(agencyOffer) updateQuery = { ...updateQuery, "agencyOffer": agencyOffer };
            if(cancelRequested) updateQuery = { ...updateQuery, "cancelRequested": cancelRequested };
            if(cancelReqMsg) updateQuery = { ...updateQuery, "cancelReqMsg": cancelReqMsg };
            if(clientID) updateQuery = { ...updateQuery, "clientID": new ObjectId(clientID) };
            if(endDate) updateQuery = { ...updateQuery, "endDate": endDate };
            if(objectID) updateQuery = { ...updateQuery, "objectID": new ObjectId(objectID) };
            if(objectType) updateQuery = { ...updateQuery, "objectType": objectType };
            if(objectAddress) updateQuery = { ...updateQuery, "objectAddress": objectAddress };
            if(startDate) updateQuery = { ...updateQuery, "startDate": startDate };
            if(clientFirstname) updateQuery = { ...updateQuery, "clientFirstname": clientFirstname };
            if(clientLastname) updateQuery = { ...updateQuery, "clientLastname": clientLastname };
            if(clientMail) updateQuery = { ...updateQuery, "clientMail": clientMail };
            if(clientPhone) updateQuery = { ...updateQuery, "clientPhone": clientPhone };
            if(assignedEmployees) updateQuery = { ...updateQuery, "assignedEmployees": assignedEmployees };

            const jobID = new ObjectId(mongoSanitaze(req.body.jobID));


            const updatedJob = await JobModel.findOneAndUpdate({ "_id": jobID }, updateQuery, {new: true}).orFail();
            return res.status(200).json(updatedJob);
        } catch(err) {
            console.log(err);
            return res.status(500).json({"errMsg": "Došlo je do greške. Pokušajte ponovo."});
        }
    }


    getAllClientJobs = async (req: Request, res: Response) => {
        try {
            const clientID = new ObjectId(mongoSanitaze(req.body.clientID));

            const allJobs = await JobModel.find({ "clientID": clientID }).orFail();
            return res.status(200).json(allJobs);
        } catch(err) {
            console.log(err);
            return res.status(500).json({"errMsg": "Došlo je do greške. Pokušajte ponovo."});
        }
    }


    getJobByID = async (req: Request, res: Response) => {
        try {
            const jobID = new ObjectId(mongoSanitaze(req.body.jobID));

            const job = await JobModel.findOne({ "_id": jobID }).orFail();
            return res.status(200).json(job);
        } catch(err) {
            console.log(err);
            return res.status(500).json({"errMsg": "Došlo je do greške. Pokušajte ponovo."});
        }
    }


    deleteJob = async (req: Request, res: Response) => {
        try {
            const jobID = new ObjectId(mongoSanitaze(req.body.jobID));

            await JobModel.deleteOne({ "_id": jobID }).orFail();
            return res.status(200).json({"errMsg": "Posao uspešno izbrisan."});
        } catch(err) {
            console.log(err);
            return res.status(500).json({"errMsg": "Došlo je do greške. Pokušajte ponovo."});
        }
    }
}