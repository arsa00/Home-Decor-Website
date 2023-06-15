import { NextFunction, Response } from 'express';
import { Request } from 'express';
import { UserModel } from '../models/user';
import path from 'path';

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");

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
                    // generating JWT & returning user in JSON format (but with reduced data)

                    const token = jwt.sign({ _id: user._id, type: user.type }, process.env.TOKEN_SECRET);

                    user.password = null;
                    // user._id = null; // maybe

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

            /*if(req.body.image) {
                const userFolder = path.join(__dirname, "../../assets/images/" + username);
                let imgType = req.body.image.substring(req.body.image.indexOf("image/"), req.body.image.indexOf(";base64,"));
                imgType = imgType.replace("image/", "");
                console.log(imgType);
                let base64Img = req.body.image.replace(/^data.*;base64,/, "");

                if (!fs.existsSync(userFolder)){
                    fs.mkdirSync(userFolder);
                }

                fs.writeFile(`${ userFolder }/profileImg.${imgType}`, base64Img, "base64", (err) => {
                        if (err)
                            console.log(err);
                        else 
                            console.log("File written successfully\n");
                    }
                );
            }*/

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

        return res.status(500).json({"errMsg": "Došlo je do greške. Pokušajte ponovo."});
    }

}