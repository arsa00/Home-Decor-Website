import { NextFunction, Response } from 'express';
import { Request } from 'express';
import { UserModel } from '../models/user';
import path from 'path';

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const nodemailer = require("nodemailer");

export class UserController {
    private static readonly ADMIN_TYPE: string = "admin";
    private static readonly AGENCY_TYPE: string = "agency";
    private static readonly CLIENT_TYPE: string = "client";
    private static readonly STATUS_PENDING: string = "PENDING";
    private static readonly STATUS_ACCEPTED: string = "ACCEPTED";
    private static readonly STATUS_REJECTED: string = "REJECTED";

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
                description: req.body.description
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

        // create user's folder in assets/images/, if it doesn't already exist
        if (fs.existsSync(userFolder)){
            console.log("Image successfuly uploaded");
            const user = await UserModel.findOneAndUpdate({ username: req.body.username }, { imageType: imageType }, { new: true });

            return res.status(200).json(user);
        }

        return res.status(400).json({"errMsg": "Došlo je do greške. Pokušajte ponovo."});
    }


    generateRecoveryLink = async (req: Request, res: Response) => {

        const userExist = await UserModel.findOne({"mail": req.body.mail});
        if(!userExist) return res.status(400).json({"errMsg": "Ne postoji korisnik sa unetom email adresom"});

        // user exist, proceed to creating recovery link
        // console.log(new Date().getTime()); // TODO: delete
        const salt = await bcrypt.genSalt(10);
        let recLink = await bcrypt.hash(`${ userExist.password }#${ new Date().getTime() }#${ userExist._id }`, salt);
        recLink = recLink.replaceAll("/", "\\");

        // save recovery link to database
        await UserModel.findOneAndUpdate(
            { "_id": userExist._id }, 
            { "recoveryLink": recLink, "recoveryLinkTime": new Date().getTime() }
        );

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
        
        const userWithLink = await UserModel.findOne({"recoveryLink": req.body.recoveryLink})
        if(!userWithLink) return res.status(400).json({"errMsg": "Nevalidan link za resetovanje lozinke."});

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
            await UserModel.findOneAndUpdate({ "_id": userWithLink._id }, { "password": newPassword });
        } catch(err) {
            console.log(err);
            return res.status(500).json({"errMsg": "Došlo je do greške prilikom promene lozinke. Pokušajte ponovo."});
        }

        // password successfully changed
        await UserModel.findOneAndUpdate({ "_id": userWithLink._id }, { "recoveryLink": null });
        return res.status(200).json({"succMsg": "Lozinka uspešno promenjena."});
    }

}