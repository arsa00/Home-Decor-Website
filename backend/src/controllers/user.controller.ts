import { NextFunction, Response } from 'express';
import { Request } from 'express';
import { UserModel } from '../models/user';
import path from 'path';
import mongoose from 'mongoose';
import { CommentModel } from '../models/comment';
import { JobModel } from '../models/job';

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const nodemailer = require("nodemailer");
const mongoSanitaze = require("mongo-sanitize");

export class UserController {
    static readonly ADMIN_TYPE: string = "admin";
    static readonly AGENCY_TYPE: string = "agency";
    static readonly CLIENT_TYPE: string = "client";
    static readonly STATUS_PENDING: string = "PENDING";
    static readonly STATUS_ACCEPTED: string = "ACCEPTED";
    static readonly STATUS_REJECTED: string = "REJECTED";

    login = (req: Request, res: Response) => {

        const username = req.body.username;

        UserModel.findOne({"username": username}, async (err, user) => {
            if(err) {
                console.log(err);
                return res.status(500).json({errMsg: "Došlo je do greške. Pokušajte ponovo."});
            }
            else {
                if(!user) {
                    return res.status(400).json({errMsg: "Pogrešno korisničko ime"});
                }

                // hash password before check
                const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);

                if(isPasswordCorrect) {
                    // check if user's account is accepted
                    if(user.status === UserController.STATUS_PENDING) {
                        return res.status(400).json({errMsg: "Vaš nalog još uvek nije odobren od strane administratora"});
                    }

                    if(user.status === UserController.STATUS_REJECTED) {
                        return res.status(400).json({errMsg: "Vaš nalog je blokiran. Kontaktirajte korisničku podršku."});
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
                    if(user.recoveryLink) user.recoveryLink = null;

                    let retType = {
                        ...user._doc,
                        jwt: token
                    }
                    
                    return res.json(retType);
                } else {
                    return res.status(400).json({errMsg: "Pogrešna lozinka"});
                }
            }
        });

    }


    register = async (req: Request, res: Response) => {

        // console.log(req.body);

        const username = req.body.username;
        const usernameExist = await UserModel.findOne({"username": username});
        if(usernameExist) return res.status(409).json({errMsg: "Uneto korisničko ime već postoji"});

        const mailAddrExist = await UserModel.findOne({"mail": req.body.mail});
        if(mailAddrExist) return res.status(409).json({errMsg: "Uneta mejl adresa se već koristi"});

        const type = req.body.type;

        // hash password
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash(req.body.password, salt);

        if(type === UserController.AGENCY_TYPE) {
            // insert agency
            const newUser = new UserModel({
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
                await newUser.save();
                return res.status(200).json({"succMsg": "Agencija uspešno dodata"});
            } catch (err) {
                console.log(err);
                return res.status(500).json({"errMsg": "Došlo je do greške. Pokušajte ponovo."})
            }
        }

        if(type === UserController.CLIENT_TYPE) {
            // insert client
            const newUser = new UserModel({
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
                await newUser.save();
                return res.status(200).json({"succMsg": "Klijent uspešno dodat"});
            } catch (err) {
                console.log(err);
                return res.status(500).json({"errMsg": "Došlo je do greške. Pokušajte ponovo."});
            }
        }

        return res.status(400).json({"errMsg": "Loš zahtev"});
    }


    profileImgUpload = async (req: Request, res: Response, next: NextFunction) => {
        const imageType = path.extname(req["file"].originalname);
        const userFolder = path.join(__dirname, `../../assets/images/${req.body.username}/profileImg${imageType}`);

        // if user's folder doesn't already exist in assets/images/ ==> error
        if (fs.existsSync(userFolder)){
            console.log("Image successfuly uploaded");
            try{
                const user = await UserModel.findOneAndUpdate({ username: req.body.username }, { imageType: imageType }, { new: true }).orFail();
                await CommentModel.updateMany({ "authorUsername": user.username }, { "authorImgType": imageType });
                return res.status(200).json(user);
            } catch (err) {
                return res.status(500).json({"errMsg": "Došlo je do greške. Pokušajte ponovo."});
            }

            
        }

        return res.status(500).json({"errMsg": "Došlo je do greške. Pokušajte ponovo."});
    }


    generateRecoveryLink = async (req: Request, res: Response) => {

        let userExist;

        try{
            userExist = await UserModel.findOne({"mail": req.body.mail}).orFail();
        } catch(err) {
            return res.status(400).json({"errMsg": "Ne postoji korisnik sa unetom email adresom"});
        }

        // user exist, proceed to creating recovery link
        // console.log(new Date().getTime()); // TODO: delete
        const salt = await bcrypt.genSalt(10);
        let recLink = await bcrypt.hash(`${ userExist.password }#${ new Date().getTime() }#${ userExist._id }`, salt);
        recLink = recLink.replaceAll("/", "\\");

        // save recovery link to database
        try {
            await UserModel.findOneAndUpdate(
                { "_id": userExist._id }, 
                { "recoveryLink": recLink, "recoveryLinkTime": new Date().getTime() }
            ).orFail();
        } catch(err) {
            return res.status(500).json({"errMsg": "Došlo je do greške. Pokušajte ponovo."});
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
            htmlMail = fs.readFileSync(path.resolve(__dirname, "../../src/views/html-mail-pass-reset.html"), 'utf8');
            htmlMail = htmlMail
                        .replaceAll("#WEBSITE_URL", process.env.FRONT_URL)
                        .replaceAll("#FULL_RECOVERY_LINK", `${process.env.FRONT_URL}/resetPassword/${recLink}`);
        } catch(err) {
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
            if(err) {
                console.log(err);
                return res.status(500).json({"errMsg": "Došlo je do greške. Pokušajte ponovo."});
            } else {
                console.log("Pass reset mail sent successfully: " + info.response);
                return res.status(200).json({"succMsg": "Zahtev za resetovanje lozinke uspešno poslat"});;
            }
        });
    }


    /*
        if "password" is sent within request: endpoint is reseting password [if recovery link is valid]
        if "password" is not sent within request: endpoint just checks if recovery link is valid or not
    */
    resetPassword = async (req: Request, res: Response) => {
        if(!req.body.recoveryLink) return res.status(400).json({"errMsg": "Loš zahtev. Pošaljite link za resetovanje lozinke."});
        
        let userWithLink;

        try {
            userWithLink = await UserModel.findOne({"recoveryLink": req.body.recoveryLink}).orFail();
        } catch(err) {
            return res.status(400).json({"errMsg": "Nevalidan link za resetovanje lozinke."});
        }

        // if recovery link is created more than 10 minutes ago, it's no longer valid ==> delete + return error
        const TIME_THRESHOLD: number = 600_000;
        if(new Date().getTime() - userWithLink.recoveryLinkTime > TIME_THRESHOLD) {
            await UserModel.findOneAndUpdate({ "_id": userWithLink._id }, { "recoveryLink": null });
            return res.status(400).json({"errMsg": "Nevalidan link za resetovanje lozinke."});
        }

        // link valid
        if(!req.body.password) return res.status(200).json({"succMsg": "Validan link za resetovanje lozinke."});

        const salt = await bcrypt.genSalt(10);
        const newPassword = await bcrypt.hash(req.body.password, salt);

        try {
            await UserModel.findOneAndUpdate({ "_id": userWithLink._id }, { "password": newPassword }).orFail();
        } catch(err) {
            console.log(err);
            return res.status(500).json({"errMsg": "Došlo je do greške prilikom promene lozinke. Pokušajte ponovo."});
        }

        // password successfully changed
        await UserModel.findOneAndUpdate({ "_id": userWithLink._id }, { "recoveryLink": null });
        return res.status(200).json({"succMsg": "Lozinka uspešno promenjena."});
    }


    updateData = async (req: Request, res: Response) => {
        const username = mongoSanitaze(req.body.username);
        const firstname = mongoSanitaze(req.body.firstname);
        const lastname = mongoSanitaze(req.body.lastname);
        const phone = mongoSanitaze(req.body.phone);
        const mail = mongoSanitaze(req.body.mail);
        const name = mongoSanitaze(req.body.name);
        const address = mongoSanitaze(req.body.address);
        const description = mongoSanitaze(req.body.description);
        const newUsername = mongoSanitaze(req.body.newUsername);

        const user = await UserModel.findOne({ "username": username }).orFail();

        if(newUsername && newUsername != user.username) {
            const usernameExist = await UserModel.findOne({ "username": newUsername });
            if(usernameExist) return res.status(409).json({errMsg: "Uneto korisničko ime već postoji"});
        }

        if(mail && mail != user.mail) {
            const mailAddrExist = await UserModel.findOne({ "mail": mail });
            if(mailAddrExist) return res.status(409).json({errMsg: "Uneta mejl adresa se već koristi"});
        }

        let updateQuery;

        // common data
        if(newUsername) updateQuery = { ...updateQuery, "username": newUsername };
        if(phone) updateQuery = { ...updateQuery, "phone": phone };
        if(mail) updateQuery = { ...updateQuery, "mail": mail };

        // client's data
        if(firstname) updateQuery = { ...updateQuery, "firstname": firstname };
        if(lastname) updateQuery = { ...updateQuery, "lastname": lastname };
        
        // agency's data
        if(name) updateQuery = { ...updateQuery, "name": name };
        if(address) updateQuery = { ...updateQuery, "address": address };
        if(description) updateQuery = { ...updateQuery, "description": description };

        // console.log( updateQuery );

        if(!updateQuery) return res.status(400).json({"errMsg": "Loš zahtev. Pošaljite nove podatke."});

        try {
            const newUser = await UserModel.findOneAndUpdate({ "username": username }, updateQuery, { new: true }).orFail();

            // update referenced redundant data used for better query performance

            // comment
            let commentUpdateQuery;
            if(newUsername) commentUpdateQuery = { ...commentUpdateQuery, "authorUsername": newUsername };
            if(firstname) commentUpdateQuery = { ...commentUpdateQuery, "authorFirstname": firstname };
            if(lastname) commentUpdateQuery = { ...commentUpdateQuery, "authorLastname": lastname };
            await CommentModel.updateMany({ "authorUsername": username }, commentUpdateQuery);

            // job [agency]
            if(newUser.type == UserController.AGENCY_TYPE) {
                let agencyJobUpdateQuery;
                if(name) agencyJobUpdateQuery = { "agencyName": name };
                await JobModel.updateMany({ "agencyID": newUser._id }, agencyJobUpdateQuery);
            }

            // job [client]
            if(newUser.type == UserController.CLIENT_TYPE) {
                let clientJobUpdateQuery;
                if(firstname) clientJobUpdateQuery = { ...clientJobUpdateQuery, "clientFirstname": firstname };
                if(lastname) clientJobUpdateQuery = { ...clientJobUpdateQuery, "clientLastname": lastname };
                if(phone) clientJobUpdateQuery = { ...clientJobUpdateQuery, "clientPhone": phone };
                if(mail) clientJobUpdateQuery = { ...clientJobUpdateQuery, "clientMail": mail };
                await JobModel.updateMany({ "clientID": newUser._id }, clientJobUpdateQuery);
            }

            newUser.password = null;
            // user._id = null; // maybe
            if(newUser.recoveryLink) newUser.recoveryLink = null;
            return res.status(200).json(newUser);
        } catch(err) {
            console.log(err);
            return res.status(500).json({"errMsg": "Došlo je do greške. Pokušajte ponovo."});
        }
    }


    changePassword = async (req: Request, res: Response) => {
        const username = mongoSanitaze(req.body.username);
        const oldPassword = req.body.oldPassword; // can have '$' so sanitaze can't be performed (it's being hashed anyway)
        const newPassword = req.body.newPassword;

        if(!username || !oldPassword || !newPassword) {
            return res.status(400).json({"errMsg": "Loš zahtev. Pošaljite sve neophodne podatke."});
        }

        let user;

        try {
            user = await UserModel.findOne({ "username": username }).orFail();
        } catch(err) {
            console.log(err);
            return res.status(400).json({"errMsg": "Loš zahtev. Pošaljite ispavne podatke."});
        }

        // hash and check password
        const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);

        if(!isPasswordCorrect) {
            return res.status(400).json({"errMsg": "Loš zahtev. Pogrešna stara lozinka."});
        }

        try {
            const salt = await bcrypt.genSalt(10);
            const newHashedPassword = await bcrypt.hash(newPassword, salt);
            await UserModel.findOneAndUpdate({ "_id": user._id }, { "password": newHashedPassword }).orFail();
            return res.status(200).json({"succMsg": "Lozinka uspešno promenjena."});
        } catch(err) {
            console.log(err);
            return res.status(500).json({"errMsg": "Došlo je do greške prilikom promene lozinke. Pokušajte ponovo."});
        }
    }


    getNumberOfUsers = async (req: Request, res: Response) => {
        try {
            const numOfUsers = await UserModel.countDocuments({ "type": { "$ne": UserController.ADMIN_TYPE } });
            return res.status(200).json({"numOfUsers": numOfUsers});
        } catch(err) {
            console.log(err);
            return res.status(500).json({"errMsg": "Došlo je do greške. Pokušajte ponovo."});
        }
    }


    getNumberOfPendingUsers = async (req: Request, res: Response) => {
        try {
            const numOfUsers = await UserModel.countDocuments(
                { "type": { "$ne": UserController.ADMIN_TYPE }, "status": UserController.STATUS_PENDING  }
            );
            return res.status(200).json({"numOfUsers": numOfUsers});
        } catch(err) {
            console.log(err);
            return res.status(500).json({"errMsg": "Došlo je do greške. Pokušajte ponovo."});
        }
    }


    getSliceOfUsers = async (req: Request, res: Response) => {
        try {
            const offset = mongoSanitaze(req.body.offset);
            const limit = mongoSanitaze(req.body.limit);

            const users = await UserModel.find({ "type": { "$ne": UserController.ADMIN_TYPE } }).skip(offset).limit(limit);
            return res.status(200).json(users);
        } catch(err) {
            console.log(err);
            return res.status(500).json({"errMsg": "Došlo je do greške. Pokušajte ponovo."});
        }
    }


    getSliceOfPendingUsers = async (req: Request, res: Response) => {
        try {
            const offset = mongoSanitaze(req.body.offset);
            const limit = mongoSanitaze(req.body.limit);

            const users = await UserModel.find(
                { 
                    "type": { "$ne": UserController.ADMIN_TYPE }, 
                    "status": UserController.STATUS_PENDING 
                }
            ).skip(offset).limit(limit);
            return res.status(200).json(users);
        } catch(err) {
            console.log(err);
            return res.status(500).json({"errMsg": "Došlo je do greške. Pokušajte ponovo."});
        }
    }


    deleteUserById = async (req: Request, res: Response) => {
        try {
            const userId = new mongoose.Types.ObjectId(mongoSanitaze(req.body.userId));

            await UserModel.findOneAndDelete({ "_id": userId }).orFail();
            return res.status(200).json({"succMsg": "Korisnik uspešno obirsan."});
        } catch(err) {
            console.log(err);
            return res.status(500).json({"errMsg": "Došlo je do greške. Pokušajte ponovo."});
        }
    }


    acceptRegisterRequest = async (req: Request, res: Response) => {
        try {
            const userId = new mongoose.Types.ObjectId(mongoSanitaze(req.body.userId));

            await UserModel.findOneAndUpdate({ "_id": userId }, { "status": UserController.STATUS_ACCEPTED } ).orFail();
            return res.status(200).json({"succMsg": "Zahtev uspešno prihvaćen."});
        } catch(err) {
            console.log(err);
            return res.status(500).json({"errMsg": "Došlo je do greške. Pokušajte ponovo."});
        }
    }


    rejectRegisterRequest = async (req: Request, res: Response) => {
        try {
            const userId = new mongoose.Types.ObjectId(mongoSanitaze(req.body.userId));

            await UserModel.findOneAndUpdate({ "_id": userId }, { "status": UserController.STATUS_REJECTED } ).orFail();
            return res.status(200).json({"succMsg": "Zahtev uspešno prihvaćen."});
        } catch(err) {
            console.log(err);
            return res.status(500).json({"errMsg": "Došlo je do greške. Pokušajte ponovo."});
        }
    }
}