"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_1 = require("../models/user");
const path_1 = __importDefault(require("path"));
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const nodemailer = require("nodemailer");
class UserController {
    constructor() {
        this.login = (req, res) => {
            const username = req.body.username;
            user_1.UserModel.findOne({ "username": username }, (err, user) => __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ errMsg: "Došlo je do greške. Pokušajte ponovo." });
                }
                else {
                    if (!user) {
                        return res.status(400).json({ errMsg: "Pogrešno korisničko ime" });
                    }
                    // hash password before check
                    const isPasswordCorrect = yield bcrypt.compare(req.body.password, user.password);
                    if (isPasswordCorrect) {
                        // generating JWT & returning user in JSON format (but with reduced data)
                        const token = jwt.sign({ _id: user._id, type: user.type }, process.env.TOKEN_SECRET);
                        user.password = null;
                        // user._id = null; // maybe
                        if (user.recoveryLink)
                            user.recoveryLink = null;
                        let retType = Object.assign(Object.assign({}, user._doc), { jwt: token });
                        return res.json(retType);
                    }
                    else {
                        return res.status(400).json({ errMsg: "Pogrešna lozinka" });
                    }
                }
            }));
        };
        this.register = (req, res) => __awaiter(this, void 0, void 0, function* () {
            // console.log(req.body);
            const username = req.body.username;
            const usernameExist = yield user_1.UserModel.findOne({ "username": username });
            if (usernameExist)
                return res.status(409).json({ errMsg: "Uneto korisničko ime već postoji" });
            const type = req.body.type;
            // hash password
            const salt = yield bcrypt.genSalt(10);
            const password = yield bcrypt.hash(req.body.password, salt);
            if (type === UserController.AGENCY_TYPE) {
                // insert agency
                const newUser = new user_1.UserModel({
                    username: username,
                    password: password,
                    type: type,
                    status: UserController.STATUS_PENDING,
                    name: req.body.name,
                    address: req.body.address,
                    idNumber: req.body.idNumber,
                    phone: req.body.phone,
                    mail: req.body.mail,
                    description: req.body.description
                });
                // MAYBE TODO: add additional validation of data in request body
                try {
                    yield newUser.save();
                    return res.status(200).json({ "succMsg": "Agencija uspešno dodata" });
                }
                catch (err) {
                    console.log(err);
                    return res.status(500).json({ "errMsg": "Došlo je do greške. Pokušajte ponovo." });
                }
            }
            if (type === UserController.CLIENT_TYPE) {
                // insert client
                const newUser = new user_1.UserModel({
                    username: username,
                    password: password,
                    type: type,
                    status: UserController.STATUS_PENDING,
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    phone: req.body.phone,
                    mail: req.body.mail
                });
                // MAYBE TODO: add additional validation of data in request body
                try {
                    yield newUser.save();
                    return res.status(200).json({ "succMsg": "Klijent uspešno dodat" });
                }
                catch (err) {
                    console.log(err);
                    return res.status(500).json({ "errMsg": "Došlo je do greške. Pokušajte ponovo." });
                }
            }
            return res.status(400).json({ "errMsg": "Loš zahtev" });
        });
        this.profileImgUpload = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const imageType = path_1.default.extname(req["file"].originalname);
            const userFolder = path_1.default.join(__dirname, `../../assets/images/${req.body.username}/profileImg${imageType}`);
            // create user's folder in assets/images/, if it doesn't already exist
            if (fs.existsSync(userFolder)) {
                console.log("Image successfuly uploaded");
                const user = yield user_1.UserModel.findOneAndUpdate({ username: req.body.username }, { imageType: imageType }, { new: true });
                return res.status(200).json(user);
            }
            return res.status(400).json({ "errMsg": "Došlo je do greške. Pokušajte ponovo." });
        });
        this.generateRecoveryLink = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const userExist = yield user_1.UserModel.findOne({ "mail": req.body.mail });
            if (!userExist)
                return res.status(400).json({ "errMsg": "Ne postoji korisnik sa unetom email adresom" });
            // user exist, proceed to creating recovery link
            // console.log(new Date().getTime()); // TODO: delete
            const salt = yield bcrypt.genSalt(10);
            let recLink = yield bcrypt.hash(`${userExist.password}#${new Date().getTime()}#${userExist._id}`, salt);
            recLink = recLink.replaceAll("/", "\\");
            // save recovery link to database
            yield user_1.UserModel.findOneAndUpdate({ "_id": userExist._id }, { "recoveryLink": recLink, "recoveryLinkTime": new Date().getTime() });
            // set delayed function (10 min = 600,000 sec) to delete recoveryLink
            // setTimeout(async () => {
            //     await UserModel.findOneAndUpdate({ "_id": userExist._id }, { "recoveryLink": null });
            // }, 600_000);
            // send recovery link to mail
            const emailAddr = "sa_etf@hotmail.com";
            const transporter = nodemailer.createTransport({
                service: "hotmail",
                auth: {
                    user: emailAddr,
                    pass: process.env.MAIL_SECRET
                }
            });
            const mail = {
                from: emailAddr,
                to: userExist.mail,
                subject: "[ Home Decor Website ] Resetovanje lozinke",
                text: `Vašu lozinku možete resetovati na sledećem linku: http://localhost:4200/resetPassword/${recLink}`
            };
            transporter.sendMail(mail, (err, info) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ "errMsg": "Došlo je do greške. Pokušajte ponovo." });
                }
                else {
                    console.log("Pass reset mail sent successfully: " + info.response);
                    return res.status(200).json({ "succMsg": "Zahtev za resetovanje lozinke uspešno poslat" });
                    ;
                }
            });
        });
        /*
            if "password" is sent within request: endpoint is reseting password [if recovery link is valid]
            if "password" is not sent within request: endpoint just checks if recovery link is valid or not
        */
        this.resetPassword = (req, res) => __awaiter(this, void 0, void 0, function* () {
            if (!req.body.recoveryLink)
                return res.status(400).json({ "errMsg": "Loš zahtev. Pošaljite link za resetovanje lozinke." });
            const userWithLink = yield user_1.UserModel.findOne({ "recoveryLink": req.body.recoveryLink });
            if (!userWithLink)
                return res.status(400).json({ "errMsg": "Nevalidan link za resetovanje lozinke." });
            const TIME_THRESHOLD = 600000;
            if (new Date().getTime() - userWithLink.recoveryLinkTime > TIME_THRESHOLD) {
                yield user_1.UserModel.findOneAndUpdate({ "_id": userWithLink._id }, { "recoveryLink": null });
                return res.status(400).json({ "errMsg": "Nevalidan link za resetovanje lozinke." });
            }
            // link valid
            if (!req.body.password)
                return res.status(200).json({ "succMsg": "Validan link za resetovanje lozinke." });
            const salt = yield bcrypt.genSalt(10);
            const newPassword = yield bcrypt.hash(req.body.password, salt);
            try {
                yield user_1.UserModel.findOneAndUpdate({ "_id": userWithLink._id }, { "password": newPassword });
            }
            catch (err) {
                console.log(err);
                return res.status(500).json({ "errMsg": "Došlo je do greške prilikom promene lozinke. Pokušajte ponovo." });
            }
            // password successfully changed
            yield user_1.UserModel.findOneAndUpdate({ "_id": userWithLink._id }, { "recoveryLink": null });
            return res.status(200).json({ "succMsg": "Lozinka uspešno promenjena." });
        });
    }
}
exports.UserController = UserController;
UserController.ADMIN_TYPE = "admin";
UserController.AGENCY_TYPE = "agency";
UserController.CLIENT_TYPE = "client";
UserController.STATUS_PENDING = "PENDING";
UserController.STATUS_ACCEPTED = "ACCEPTED";
UserController.STATUS_REJECTED = "REJECTED";
//# sourceMappingURL=user.controller.js.map