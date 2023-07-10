"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtAuth = void 0;
const user_controller_1 = require("../controllers/user.controller");
const jwt = require("jsonwebtoken");
class JwtAuth {
    constructor() {
        // TODO: better to set jwt to header (or cookie) than within body of requst!
        this.postValidateJwt = (req, res, next) => {
            try {
                const token = req.body.jwt;
                var decoded = jwt.verify(token, process.env.TOKEN_SECRET);
                next();
            }
            catch (err) {
                return res.status(400).json({ "errMsg": "Niste autorizovani, pristup odbijen." });
            }
        };
        this.getValidateJwt = (req, res, next) => {
            try {
                const token = req.query.jwt;
                var decoded = jwt.verify(token, process.env.TOKEN_SECRET);
                next();
            }
            catch (err) {
                return res.status(400).json({ "errMsg": "Niste autorizovani, pristup odbijen." });
            }
        };
        this.postValidateJwtAndClientType = (req, res, next) => {
            try {
                const token = req.body.jwt;
                var decoded = jwt.verify(token, process.env.TOKEN_SECRET);
                if (decoded.type != user_controller_1.UserController.CLIENT_TYPE)
                    throw Error();
                next();
            }
            catch (err) {
                return res.status(400).json({ "errMsg": "Niste autorizovani, pristup odbijen." });
            }
        };
        this.getValidateJwtAndClientType = (req, res, next) => {
            try {
                const token = req.query.jwt;
                var decoded = jwt.verify(token, process.env.TOKEN_SECRET);
                if (decoded.type != user_controller_1.UserController.CLIENT_TYPE)
                    throw Error();
                next();
            }
            catch (err) {
                return res.status(400).json({ "errMsg": "Niste autorizovani, pristup odbijen." });
            }
        };
        this.postValidateJwtAndAgencyType = (req, res, next) => {
            try {
                const token = req.body.jwt;
                var decoded = jwt.verify(token, process.env.TOKEN_SECRET);
                if (decoded.type != user_controller_1.UserController.AGENCY_TYPE)
                    throw Error();
                next();
            }
            catch (err) {
                return res.status(400).json({ "errMsg": "Niste autorizovani, pristup odbijen." });
            }
        };
        this.getValidateJwtAndAgencyType = (req, res, next) => {
            try {
                const token = req.query.jwt;
                var decoded = jwt.verify(token, process.env.TOKEN_SECRET);
                if (decoded.type != user_controller_1.UserController.AGENCY_TYPE)
                    throw Error();
                next();
            }
            catch (err) {
                return res.status(400).json({ "errMsg": "Niste autorizovani, pristup odbijen." });
            }
        };
        this.postValidateJwtAndAdminType = (req, res, next) => {
            try {
                const token = req.body.jwt;
                var decoded = jwt.verify(token, process.env.TOKEN_SECRET);
                if (decoded.type != user_controller_1.UserController.ADMIN_TYPE)
                    throw Error();
                next();
            }
            catch (err) {
                return res.status(400).json({ "errMsg": "Niste autorizovani, pristup odbijen." });
            }
        };
        this.getValidateJwtAndAdminType = (req, res, next) => {
            try {
                const token = req.query.jwt;
                var decoded = jwt.verify(token, process.env.TOKEN_SECRET);
                if (decoded.type != user_controller_1.UserController.ADMIN_TYPE)
                    throw Error();
                next();
            }
            catch (err) {
                return res.status(400).json({ "errMsg": "Niste autorizovani, pristup odbijen." });
            }
        };
    }
}
exports.JwtAuth = JwtAuth;
//# sourceMappingURL=jwt-auth.js.map