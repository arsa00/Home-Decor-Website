import { Request, Response } from "express";
import { UserModel } from "../models/user";
import { UserController } from "./user.controller";
import { CommentModel } from "../models/comment";
import { JobModel } from "../models/job";
import { EmployeeModel } from "../models/employee";
import mongoose from "mongoose";

const mongoSanitaze = require("mongo-sanitize");
const ObjectId = mongoose.Types.ObjectId;

export class AgencyController {

    getAgencies = (req: Request, res: Response) => {

        const searchTerm: string = mongoSanitaze(req.query.searchTerm);
        const searchName: boolean = mongoSanitaze(req.query.searchName) === "true" ? true : false;
        const searchAddress: boolean = mongoSanitaze(req.query.searchAddress) === "true" ? true : false;

        let filters = [];

        if(searchName) {
            filters.push(
                { "name": { "$regex": `.*${ searchTerm }.*`, "$options": "i" } }
            );
        }

        if(searchAddress) {
            filters.push(
                { "address": { "$regex": `.*${ searchTerm }.*`, "$options": "i" } }
            );
        }

        
        UserModel.find({ 
            "type": UserController.AGENCY_TYPE, 
            "$or": [  
                ...filters
            ]
        }, (err, agencies) => {
            if(err) {
                console.log(err);
                return res.status(500).json({errMsg: "Došlo je do greške. Pokušajte ponovo."});
            }

            return res.status(200).json(agencies);
        });

    }


    getAgency = (req: Request, res: Response) => {
        let agencyID;

        try {
            agencyID = new ObjectId(mongoSanitaze(req.query.agencyID));
        } catch(err) {
            console.log(err);
            return res.status(400).json({errMsg: "Došlo je do greške. Pokušajte ponovo."});
        }

        UserModel.findOne({ "_id": agencyID }, (err, agency) => {
            if(err) {
                console.log(err);
                return res.status(500).json({errMsg: "Došlo je do greške. Pokušajte ponovo."});
            }

            return res.status(200).json(agency);
        });

    }


    getAllComments = (req: Request, res: Response) => {
        let agencyID;

        try {
            agencyID = new ObjectId(mongoSanitaze(req.query.agencyID));
        } catch(err) {
            console.log(err);
            return res.status(400).json({errMsg: "Došlo je do greške. Pokušajte ponovo."});
        }

        CommentModel.find({ "agencyId": agencyID }, (err, comments) => {
            if(err) {
                console.log(err);
                return res.status(500).json({errMsg: "Došlo je do greške. Pokušajte ponovo."});
            }

            return res.status(200).json(comments);
        });

    }


    getAllAnonymousComments = (req: Request, res: Response) => {
        let agencyID;

        try {
            agencyID = new ObjectId(mongoSanitaze(req.query.agencyID));
        } catch(err) {
            console.log(err);
            return res.status(400).json({errMsg: "Došlo je do greške. Pokušajte ponovo."});
        }

        CommentModel.find({ "agencyId": agencyID }, 
        "-authorUsername -authorFirstname -authorLastname -authorImgType", 
        (err, comments) => {
            if(err) {
                console.log(err);
                return res.status(500).json({errMsg: "Došlo je do greške. Pokušajte ponovo."});
            }

            return res.status(200).json(comments);
        });

    }


    getCommentByJobId = (req: Request, res: Response) => {
        let jobId;

        try {
            jobId = new ObjectId(mongoSanitaze(req.query.jobId));
        } catch(err) {
            console.log(err);
            return res.status(400).json({errMsg: "Došlo je do greške. Pokušajte ponovo."});
        }

        CommentModel.findOne({ "jobId": jobId }, (err, comment) => {
            if(err) {
                console.log(err);
                return res.status(500).json({errMsg: "Došlo je do greške. Pokušajte ponovo."});
            }

            return res.status(200).json(comment);
        });

    }


    addComment = async (req: Request, res: Response) => {
        try {
            const jobId = new ObjectId(mongoSanitaze(req.body.jobId));
            const comment = mongoSanitaze(req.body.comment);
            const grade = mongoSanitaze(req.body.grade);
            const clientId = new ObjectId(mongoSanitaze(req.body.clientId));

            const job = await JobModel.findOne({ "_id": jobId }).orFail();
            const author = await UserModel.findOne({ "_id": job.clientID }).orFail();

            if(!author._id.equals(clientId)) throw Error(); // someone trying adding comment for job that isn't theirs

            const agency = await UserModel.findOne({ "_id": job.agencyID }).orFail();

            const newComment = new CommentModel({
                agencyId: agency._id,
                jobId: jobId,
                comment: comment,
                grade: grade,
                authorFirstname: author.firstname,
                authorLastname: author.lastname,
                authorUsername: author.username,
                authorImgType: author.imageType
            });

            const addedComment = await newComment.save();
            return res.status(200).json(addedComment);
        } catch(err) {
            console.log(err);
            return res.status(500).json({errMsg: "Došlo je do greške. Pokušajte ponovo."});
        }
    }


    updateComment = async (req: Request, res: Response) => {
        try {
            const commentId = new ObjectId(mongoSanitaze(req.body.commentId));
            const comment = mongoSanitaze(req.body.comment);
            const grade = mongoSanitaze(req.body.grade);
            const clientUsername = mongoSanitaze(req.body.clientUsername);    // for checkup

            let updateQuery;

            if(comment) updateQuery = { "comment": comment };
            if(grade) updateQuery = { ...updateQuery, "grade": grade };

            const newComment = await CommentModel.findOneAndUpdate({ "_id": commentId, "authorUsername": clientUsername }, 
                                                                    updateQuery, { new: true }).orFail();
            return res.status(200).json(newComment);
        } catch(err) {
            console.log(err);
            return res.status(500).json({"errMsg": "Došlo je do greške. Pokušajte ponovo."});
        }
    }


    addEmployee = async (req: Request, res: Response) => {
        try {
            const agencyId = new ObjectId(mongoSanitaze(req.body.agencyId));
            const firstname = mongoSanitaze(req.body.employee.firstname);
            const lastname = mongoSanitaze(req.body.employee.lastname);
            const mail = mongoSanitaze(req.body.employee.mail);
            const phone = mongoSanitaze(req.body.employee.phone);
            const specialization = mongoSanitaze(req.body.employee.specialization);

            // check if there is enough opened positions at agency (throw err if not)
            let numOfEmployees = await EmployeeModel.find({ "agencyId": agencyId });
            await UserModel.findOne({ "_id": agencyId, "numOfOpenedPositions": { "$gt": numOfEmployees.length } }).orFail();

            // checkup successful
            const newEmployee = new EmployeeModel({
                agencyId: agencyId,
                firstname: firstname,
                lastname: lastname,
                mail: mail,
                phone: phone,
                specialization: specialization
            });

            const addedEmployee = await newEmployee.save();
            return res.status(200).json(addedEmployee);
        } catch(err) {
            console.log(err);
            return res.status(500).json({"errMsg": "Došlo je do greške. Pokušajte ponovo."});
        }
    }


    updateEmployee = async (req: Request, res: Response) => {
        try {
            const agencyId = new ObjectId(mongoSanitaze(req.body.agencyId));
            const firstname = mongoSanitaze(req.body.employee.firstname);
            const lastname = mongoSanitaze(req.body.employee.lastname);
            const mail = mongoSanitaze(req.body.employee.mail);
            const phone = mongoSanitaze(req.body.employee.phone);
            const specialization = mongoSanitaze(req.body.employee.specialization);
            const employeeId = new ObjectId(mongoSanitaze(req.body.employee._id));
            const employeeAgencyId = new ObjectId(mongoSanitaze(req.body.employee.agencyId));
            
            if(!agencyId.equals(employeeAgencyId)) throw Error();

            let updateQuery;

            if(firstname) updateQuery = { "firstname": firstname };
            if(lastname) updateQuery = { ...updateQuery, "lastname": lastname };
            if(mail) updateQuery = { ...updateQuery, "mail": mail };
            if(phone) updateQuery = { ...updateQuery, "phone": phone };
            if(specialization) updateQuery = { ...updateQuery, "specialization": specialization };
            
            const updatedEmployee = await EmployeeModel.findOneAndUpdate({ "_id": employeeId }, updateQuery, { new: true }).orFail();
            return res.status(200).json(updatedEmployee);
        } catch(err) {
            console.log(err);
            return res.status(500).json({"errMsg": "Došlo je do greške. Pokušajte ponovo."});
        }
    }


    deleteEmployee = async (req: Request, res: Response) => {
        try {
            const agencyId = new ObjectId(mongoSanitaze(req.body.agencyId));
            const employeeId = new ObjectId(mongoSanitaze(req.body.employeeId));
            
            await EmployeeModel.findOneAndDelete({ "_id": employeeId, "agencyId": agencyId }).orFail();
            return res.status(200).json({"succMsg": "Radnik uspešno obirsan."});
        } catch(err) {
            console.log(err);
            return res.status(500).json({"errMsg": "Došlo je do greške. Pokušajte ponovo."});
        }
    }


    getAllEmployeesForAgency = async (req: Request, res: Response) => {
        try {
            const agencyId = new ObjectId(mongoSanitaze(req.body.agencyId));
            
            const allEmployees = await EmployeeModel.find({ "agencyId": agencyId });
            return res.status(200).json(allEmployees);
        } catch(err) {
            console.log(err);
            return res.status(500).json({"errMsg": "Došlo je do greške. Pokušajte ponovo."});
        }
    }


    getNumOfOpenedPositions = async (req: Request, res: Response) => {
        try {
            const agencyId = new ObjectId(mongoSanitaze(req.body.agencyId));
            
            const agency = await UserModel.findOne({ "_id": agencyId }).orFail();
            return res.status(200).json({"numOfOpenedPositions": agency.numOfOpenedPositions});
        } catch(err) {
            console.log(err);
            return res.status(500).json({"errMsg": "Došlo je do greške. Pokušajte ponovo."});
        }
    }

}