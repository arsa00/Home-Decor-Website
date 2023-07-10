import { NextFunction, Request, Response } from "express"
import { UserController } from "../controllers/user.controller";

const jwt = require("jsonwebtoken");

export class JwtAuth {
    // TODO: better to set jwt to header (or cookie) than within body of requst!


    postValidateJwt = (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.body.jwt;
            var decoded = jwt.verify(token, process.env.TOKEN_SECRET);
            next();
        } catch(err) {
            return res.status(400).json({"errMsg": "Niste autorizovani, pristup odbijen."});
        }
    }


    getValidateJwt = (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.query.jwt;
            var decoded = jwt.verify(token, process.env.TOKEN_SECRET);
            next();
        } catch(err) {
            return res.status(400).json({"errMsg": "Niste autorizovani, pristup odbijen."});
        }
    }


    postValidateJwtAndClientType = (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.body.jwt;
            var decoded = jwt.verify(token, process.env.TOKEN_SECRET);
            if(decoded.type != UserController.CLIENT_TYPE) throw Error();
            next();
        } catch(err) {
            return res.status(400).json({"errMsg": "Niste autorizovani, pristup odbijen."});
        }
    }


    getValidateJwtAndClientType  = (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.query.jwt;
            var decoded = jwt.verify(token, process.env.TOKEN_SECRET);
            if(decoded.type != UserController.CLIENT_TYPE) throw Error();
            next();
        } catch(err) {
            return res.status(400).json({"errMsg": "Niste autorizovani, pristup odbijen."});
        }
    }


    postValidateJwtAndAgencyType = (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.body.jwt;
            var decoded = jwt.verify(token, process.env.TOKEN_SECRET);
            if(decoded.type != UserController.AGENCY_TYPE) throw Error();
            next();
        } catch(err) {
            return res.status(400).json({"errMsg": "Niste autorizovani, pristup odbijen."});
        }
    }


    getValidateJwtAndAgencyType  = (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.query.jwt;
            var decoded = jwt.verify(token, process.env.TOKEN_SECRET);
            if(decoded.type != UserController.AGENCY_TYPE) throw Error();
            next();
        } catch(err) {
            return res.status(400).json({"errMsg": "Niste autorizovani, pristup odbijen."});
        }
    }


    postValidateJwtAndAdminType = (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.body.jwt;
            var decoded = jwt.verify(token, process.env.TOKEN_SECRET);
            if(decoded.type != UserController.ADMIN_TYPE) throw Error();
            next();
        } catch(err) {
            return res.status(400).json({"errMsg": "Niste autorizovani, pristup odbijen."});
        }
    }


    getValidateJwtAndAdminType  = (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.query.jwt;
            var decoded = jwt.verify(token, process.env.TOKEN_SECRET);
            if(decoded.type != UserController.ADMIN_TYPE) throw Error();
            next();
        } catch(err) {
            return res.status(400).json({"errMsg": "Niste autorizovani, pristup odbijen."});
        }
    }

}