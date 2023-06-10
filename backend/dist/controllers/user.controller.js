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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_1 = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
class UserController {
    constructor() {
        this.login = (req, res) => {
            const username = req.body.username;
            user_1.UserModel.findOne({ "username": username }, (err, user) => __awaiter(this, void 0, void 0, function* () {
                if (err) {
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
                        // user._id = null;
                        return res.header("jwt", token).json(user);
                    }
                    else {
                        return res.status(400).json({ errMsg: "Pogrešna lozinka" });
                    }
                }
            }));
        };
        this.register = (req, res) => __awaiter(this, void 0, void 0, function* () {
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
                    return res.status(200).send("User added successfully");
                }
                catch (err) {
                    return res.status(500).send(err);
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
                    return res.status(200).send("User added successfully");
                }
                catch (err) {
                    return res.status(500).send(err);
                }
            }
            return res.status(400).send("Bad request.");
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