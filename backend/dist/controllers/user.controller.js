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
const mongoSanitaze = require("mongo-sanitize");
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
                        // check if user's account is accepted
                        if (user.status === UserController.STATUS_PENDING) {
                            return res.status(400).json({ errMsg: "Vaš nalog još uvek nije odobren od strane administratora" });
                        }
                        if (user.status === UserController.STATUS_REJECTED) {
                            return res.status(400).json({ errMsg: "Vaš nalog je blokiran. Kontaktirajte korisničku podršku." });
                        }
                        // generating JWT & returning user in JSON format (but with reduced data)
                        /*
                        * NOTE:
                            - lifespan of JWT should be much less and there should be refresh token
                            - for demo purposes this is overlooked and there's just regular JWT with 3 hours long lifespan
                        */
                        const token = jwt.sign({ _id: user._id, type: user.type }, process.env.TOKEN_SECRET, { expiresIn: '3h' });
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
            const mailAddrExist = yield user_1.UserModel.findOne({ "mail": req.body.mail });
            if (mailAddrExist)
                return res.status(409).json({ errMsg: "Uneta mejl adresa se već koristi" });
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
                    description: req.body.description,
                    numOfOpenedPositions: 0
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
            // if user's folder doesn't already exist in assets/images/ ==> error
            if (fs.existsSync(userFolder)) {
                console.log("Image successfuly uploaded");
                try {
                    const user = yield user_1.UserModel.findOneAndUpdate({ username: req.body.username }, { imageType: imageType }, { new: true }).orFail();
                    return res.status(200).json(user);
                }
                catch (err) {
                    return res.status(500).json({ "errMsg": "Došlo je do greške. Pokušajte ponovo." });
                }
            }
            return res.status(500).json({ "errMsg": "Došlo je do greške. Pokušajte ponovo." });
        });
        this.generateRecoveryLink = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let userExist;
            try {
                userExist = yield user_1.UserModel.findOne({ "mail": req.body.mail }).orFail();
            }
            catch (err) {
                return res.status(400).json({ "errMsg": "Ne postoji korisnik sa unetom email adresom" });
            }
            // user exist, proceed to creating recovery link
            // console.log(new Date().getTime()); // TODO: delete
            const salt = yield bcrypt.genSalt(10);
            let recLink = yield bcrypt.hash(`${userExist.password}#${new Date().getTime()}#${userExist._id}`, salt);
            recLink = recLink.replaceAll("/", "\\");
            // save recovery link to database
            try {
                yield user_1.UserModel.findOneAndUpdate({ "_id": userExist._id }, { "recoveryLink": recLink, "recoveryLinkTime": new Date().getTime() }).orFail();
            }
            catch (err) {
                return res.status(500).json({ "errMsg": "Došlo je do greške. Pokušajte ponovo." });
            }
            // send recovery link to mail
            const emailAddr = "sa_etf@hotmail.com";
            const transporter = nodemailer.createTransport({
                service: "hotmail",
                auth: {
                    user: emailAddr,
                    pass: process.env.MAIL_SECRET
                }
            });
            let htmlMail;
            try {
                htmlMail = fs.readFileSync(path_1.default.resolve(__dirname, "../../src/views/html-mail-pass-reset.html"), 'utf8');
                htmlMail = htmlMail
                    .replaceAll("#WEBSITE_URL", process.env.FRONT_URL)
                    .replaceAll("#FULL_RECOVERY_LINK", `${process.env.FRONT_URL}/resetPassword/${recLink}`);
            }
            catch (err) {
                console.log(err);
                htmlMail = `Vašu lozinku možete resetovati klikom <a href="${process.env.FRONT_URL}/resetPassword/${recLink}">ovde</a>.`;
            }
            const mail = {
                from: emailAddr,
                to: userExist.mail,
                subject: "[ Home Decor Website ] Resetovanje lozinke",
                html: htmlMail,
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
            let userWithLink;
            try {
                userWithLink = yield user_1.UserModel.findOne({ "recoveryLink": req.body.recoveryLink }).orFail();
            }
            catch (err) {
                return res.status(400).json({ "errMsg": "Nevalidan link za resetovanje lozinke." });
            }
            // if recovery link is created more than 10 minutes ago, it's no longer valid ==> delete + return error
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
                yield user_1.UserModel.findOneAndUpdate({ "_id": userWithLink._id }, { "password": newPassword }).orFail();
            }
            catch (err) {
                console.log(err);
                return res.status(500).json({ "errMsg": "Došlo je do greške prilikom promene lozinke. Pokušajte ponovo." });
            }
            // password successfully changed
            yield user_1.UserModel.findOneAndUpdate({ "_id": userWithLink._id }, { "recoveryLink": null });
            return res.status(200).json({ "succMsg": "Lozinka uspešno promenjena." });
        });
        this.updateData = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const username = mongoSanitaze(req.body.username);
            const firstname = mongoSanitaze(req.body.firstname);
            const lastname = mongoSanitaze(req.body.lastname);
            const phone = mongoSanitaze(req.body.phone);
            const mail = mongoSanitaze(req.body.mail);
            const name = mongoSanitaze(req.body.name);
            const address = mongoSanitaze(req.body.address);
            const description = mongoSanitaze(req.body.description);
            const newUsername = mongoSanitaze(req.body.newUsername);
            const user = yield user_1.UserModel.findOne({ "username": username }).orFail();
            if (newUsername && newUsername != user.username) {
                const usernameExist = yield user_1.UserModel.findOne({ "username": newUsername });
                if (usernameExist)
                    return res.status(409).json({ errMsg: "Uneto korisničko ime već postoji" });
            }
            if (mail && mail != user.mail) {
                const mailAddrExist = yield user_1.UserModel.findOne({ "mail": mail });
                if (mailAddrExist)
                    return res.status(409).json({ errMsg: "Uneta mejl adresa se već koristi" });
            }
            let updateQuery;
            // common data
            if (newUsername)
                updateQuery = Object.assign(Object.assign({}, updateQuery), { "username": newUsername });
            if (phone)
                updateQuery = Object.assign(Object.assign({}, updateQuery), { "phone": phone });
            if (mail)
                updateQuery = Object.assign(Object.assign({}, updateQuery), { "mail": mail });
            // client's data
            if (firstname)
                updateQuery = Object.assign(Object.assign({}, updateQuery), { "firstname": firstname });
            if (lastname)
                updateQuery = Object.assign(Object.assign({}, updateQuery), { "lastname": lastname });
            // agency's data
            if (name)
                updateQuery = Object.assign(Object.assign({}, updateQuery), { "name": name });
            if (address)
                updateQuery = Object.assign(Object.assign({}, updateQuery), { "address": address });
            if (description)
                updateQuery = Object.assign(Object.assign({}, updateQuery), { "description": description });
            // console.log( updateQuery );
            if (!updateQuery)
                return res.status(400).json({ "errMsg": "Loš zahtev. Pošaljite nove podatke." });
            try {
                const newUser = yield user_1.UserModel.findOneAndUpdate({ "username": username }, updateQuery, { new: true }).orFail();
                newUser.password = null;
                // user._id = null; // maybe
                if (newUser.recoveryLink)
                    newUser.recoveryLink = null;
                return res.status(200).json(newUser);
            }
            catch (err) {
                console.log(err);
                return res.status(500).json({ "errMsg": "Došlo je do greške. Pokušajte ponovo." });
            }
        });
        this.changePassword = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const username = mongoSanitaze(req.body.username);
            const oldPassword = req.body.oldPassword; // can have '$' so sanitaze can't be performed (it's being hashed anyway)
            const newPassword = req.body.newPassword;
            if (!username || !oldPassword || !newPassword) {
                return res.status(400).json({ "errMsg": "Loš zahtev. Pošaljite sve neophodne podatke." });
            }
            let user;
            try {
                user = yield user_1.UserModel.findOne({ "username": username }).orFail();
            }
            catch (err) {
                console.log(err);
                return res.status(400).json({ "errMsg": "Loš zahtev. Pošaljite ispavne podatke." });
            }
            // hash and check password
            const isPasswordCorrect = yield bcrypt.compare(oldPassword, user.password);
            if (!isPasswordCorrect) {
                return res.status(400).json({ "errMsg": "Loš zahtev. Pogrešna stara lozinka." });
            }
            try {
                const salt = yield bcrypt.genSalt(10);
                const newHashedPassword = yield bcrypt.hash(newPassword, salt);
                yield user_1.UserModel.findOneAndUpdate({ "_id": user._id }, { "password": newHashedPassword }).orFail();
                return res.status(200).json({ "succMsg": "Lozinka uspešno promenjena." });
            }
            catch (err) {
                console.log(err);
                return res.status(500).json({ "errMsg": "Došlo je do greške prilikom promene lozinke. Pokušajte ponovo." });
            }
        });
        this.getNumberOfUsers = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const numOfUsers = yield user_1.UserModel.countDocuments({ "type": { "$ne": UserController.ADMIN_TYPE } });
                return res.status(200).json({ "numOfUsers": numOfUsers });
            }
            catch (err) {
                console.log(err);
                return res.status(500).json({ "errMsg": "Došlo je do greške prilikom promene lozinke. Pokušajte ponovo." });
            }
        });
        this.getSliceOfUsers = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const offset = mongoSanitaze(req.body.offset);
                const limit = mongoSanitaze(req.body.limit);
                const users = yield user_1.UserModel.find({ "type": { "$ne": UserController.ADMIN_TYPE } }).skip(offset).limit(limit);
                return res.status(200).json(users);
            }
            catch (err) {
                console.log(err);
                return res.status(500).json({ "errMsg": "Došlo je do greške prilikom promene lozinke. Pokušajte ponovo." });
            }
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