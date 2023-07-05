import { Request, Response } from "express";
import { UserModel } from "../models/user";
import { UserController } from "./user.controller";
import { CommentModel } from "../models/comment";

const mongoSanitaze = require("mongo-sanitize");
const ObjectId = require("mongoose").Types.ObjectId;

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


    getAgency = (req, res) => {
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


    getAllComments = (req, res) => {
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


    getAllAnonymousComments = (req, res) => {
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

}