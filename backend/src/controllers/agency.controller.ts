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

        const agencyID = mongoSanitaze(req.query.agencyID);

        UserModel.findOne({ "_id": new ObjectId(agencyID) }, (err, agency) => {
            if(err) {
                console.log(err);
                return res.status(500).json({errMsg: "Došlo je do greške. Pokušajte ponovo."});
            }

            return res.status(200).json(agency);
        });

    }


    getAllComments = (req, res) => {

        const agencyID = mongoSanitaze(req.query.agencyID);

        CommentModel.find({ "agencyId": new ObjectId(agencyID) }, (err, comments) => {
            if(err) {
                console.log(err);
                return res.status(500).json({errMsg: "Došlo je do greške. Pokušajte ponovo."});
            }

            return res.status(200).json(comments);
        });

    }

}