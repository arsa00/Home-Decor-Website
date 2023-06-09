import { Request, Response } from "express";
import { JobModel, JobState } from "../models/job";
import { ApartmentSketchModel } from "../models/apartment-sketch";
import { EmployeeModel } from "../models/employee";


const mongoSanitaze = require("mongo-sanitize");
const ObjectId = require("mongoose").Types.ObjectId;

export class JobController {

    addJob = async (req: Request, res: Response) => {
        try {
            const objectID = new ObjectId(mongoSanitaze(req.body.objectID));

            // if object is already included within another active job, reject request
            const objectAlreadyUnderConstruction = await JobModel.findOne(
                { "objectID": objectID, "state": JobState.ACTIVE }
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
        const objectAlreadyUnderConstructionErr: string = "Object already under construction";
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

            const jobID = new ObjectId(mongoSanitaze(req.body.jobID));

            if(state && state == JobState.ACTIVE) {
                const job = await JobModel.findOne({ "_id": jobID }).orFail();

                // if object is already included within another active job, reject request
                const objectAlreadyUnderConstruction = await JobModel.findOne(
                    { "objectID": job.objectID, "state": JobState.ACTIVE }
                );

                // better way: create new unique error class (that extends Error class) and throw it's instance
                if(objectAlreadyUnderConstruction) throw Error(objectAlreadyUnderConstructionErr);
            }


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


            const updatedJob = await JobModel.findOneAndUpdate({ "_id": jobID }, updateQuery, {new: true}).orFail();
            return res.status(200).json(updatedJob);
        } catch(err) {
            console.log(err);

            if(err.message == objectAlreadyUnderConstructionErr) {
                return res.status(500).json(
                    {"errMsg": "Radovi na objektu su već u toku.", "objectAlreadyUnderConstructionErr": true}
                );
            }

            return res.status(500).json({"errMsg": "Došlo je do greške. Pokušajte ponovo."});
        }
    }


    getAllClientJobs = async (req: Request, res: Response) => {
        try {
            const clientID = new ObjectId(mongoSanitaze(req.body.clientID));

            const allJobs = await JobModel.find({ "clientID": clientID });
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


    getAgencyJobsWithState = async (req: Request, res: Response) => {
        try {
            const agencyId = new ObjectId(mongoSanitaze(req.body.agencyId));
            const jobState = mongoSanitaze(req.body.jobState);

            const allJobs = await JobModel.find({ "agencyID": agencyId, "state": jobState });
            return res.status(200).json(allJobs);
        } catch(err) {
            console.log(err);
            return res.status(500).json({"errMsg": "Došlo je do greške. Pokušajte ponovo."});
        }
    }


    assignEmployeesToJob = async (req: Request, res: Response) => {
        try {
            const agencyId = new ObjectId(mongoSanitaze(req.body.agencyId));
            const jobId = new ObjectId(mongoSanitaze(req.body.jobId));
            const employees: any[] = mongoSanitaze(req.body.employees);

            if(!employees.length) throw Error();

            // check if employees exist and are they working for agency with recevied agencyId
            const employeeIds: any[] = Array.from(employees.map((employee) => {
                return employee._id;
            }));

            const employeesFromDb: any[] = await EmployeeModel.find(
                { "_id": { "$in": employeeIds }, "agencyId": agencyId }
            ).orFail();

            if(employees.length != employeesFromDb.length) throw Error();

            // assign them to job
            const updatedJob = await JobModel.findOneAndUpdate(
                { "_id": jobId, "agencyID": agencyId },
                { "$push": { "assignedEmployees": { "$each": employeesFromDb } } },
                { new: true }
            );
            return res.status(200).json(updatedJob);
        } catch(err) {
            console.log(err);
            return res.status(500).json({"errMsg": "Došlo je do greške. Pokušajte ponovo."});
        }
    }


    getNumberOfJobs = async (req: Request, res: Response) => {
        try {
            const numOfJobs = await JobModel.countDocuments({ });
            return res.status(200).json({"numOfJobs": numOfJobs});
        } catch(err) {
            console.log(err);
            return res.status(500).json({"errMsg": "Došlo je do greške. Pokušajte ponovo."});
        }
    }


    getNumberOfJobCancelRequests = async (req: Request, res: Response) => {
        try {
            const numOfJobs = await JobModel.countDocuments({ "cancelRequested": true, "state": JobState.ACTIVE });
            return res.status(200).json({"numOfJobs": numOfJobs});
        } catch(err) {
            console.log(err);
            return res.status(500).json({"errMsg": "Došlo je do greške. Pokušajte ponovo."});
        }
    }


    getSliceOfJobs = async (req: Request, res: Response) => {
        try {
            const offset = mongoSanitaze(req.body.offset);
            const limit = mongoSanitaze(req.body.limit);

            const jobs = await JobModel.find({ }).skip(offset).limit(limit);
            return res.status(200).json(jobs);
        } catch(err) {
            console.log(err);
            return res.status(500).json({"errMsg": "Došlo je do greške. Pokušajte ponovo."});
        }
    }


    getSliceOfJobCancelRequests = async (req: Request, res: Response) => {
        try {
            const offset = mongoSanitaze(req.body.offset);
            const limit = mongoSanitaze(req.body.limit);

            const jobs = await JobModel.find(
                { "cancelRequested": true, "state": JobState.ACTIVE }
            ).skip(offset).limit(limit);
            return res.status(200).json(jobs);
        } catch(err) {
            console.log(err);
            return res.status(500).json({"errMsg": "Došlo je do greške. Pokušajte ponovo."});
        }
    }


    acceptJobCancelRequest = async (req: Request, res: Response) => {
        try {
            const jobId = new ObjectId(mongoSanitaze(req.body.jobId));

            const updatedJob = await JobModel.findOneAndUpdate(
                { "_id": jobId },
                { "state": JobState.CANCELED },
                {new: true}
            ).orFail();
            return res.status(200).json(updatedJob);
        } catch(err) {
            console.log(err);
            return res.status(500).json({"errMsg": "Došlo je do greške. Pokušajte ponovo."});
        }
    }


    rejectJobCancelRequest = async (req: Request, res: Response) => {
        try {
            const jobId = new ObjectId(mongoSanitaze(req.body.jobId));

            const updatedJob = await JobModel.findOneAndUpdate(
                { "_id": jobId }, 
                { "cancelRequested": false },
                {new: true}
            ).orFail();
            return res.status(200).json(updatedJob);
        } catch(err) {
            console.log(err);
            return res.status(500).json({"errMsg": "Došlo je do greške. Pokušajte ponovo."});
        }
    }


    receiveRejectedJobCancelRequest = async (req: Request, res: Response) => {
        try {
            const jobId = new ObjectId(mongoSanitaze(req.body.jobId));

            const updatedJob = await JobModel.findOneAndUpdate(
                { "_id": jobId, "cancelRequested": false },
                { "cancelReqMsg": "" },
                {new: true}
            ).orFail();
            return res.status(200).json(updatedJob);
        } catch(err) {
            console.log(err);
            return res.status(500).json({"errMsg": "Došlo je do greške. Pokušajte ponovo."});
        }
    }
}