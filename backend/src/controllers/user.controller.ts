import { Response } from 'express'
import { Request } from 'express'
import { UserModel } from '../models/user';

export class UserController {
    private static readonly ADMIN_TYPE: string = "admin";
    private static readonly AGENCY_TYPE: string = "agency";
    private static readonly CLIENT_TYPE: string = "client";

    login = (req: Request, res: Response) => {

        const username = req.body.username;
        const password = req.body.password;

        UserModel.findOne({"username": username}, (err, user) => {
            if(err) {
                return res.json({errMsg: "Došlo je do greške. Pokušajte ponovo."});
            }
            else {
                if(!user) {
                    return res.json({errMsg: "Pogrešno korisničko ime"});
                }

                // TODO: hash password before check
                if(user.password === password) {
                    // TODO: generate JWT
                    return res.json(user);
                } else {
                    return res.json({errMsg: "Pogrešna lozinka"});
                }
            }
        });

    }

    register = async (req: Request, res: Response) => {

        const username = req.body.username;
        
        const usernameExist = await UserModel.findOne({"username": username});
        if(usernameExist) return res.json({errMsg: "Uneto korisničko ime već postoji"});

        // common attributes
        const password = req.body.password;
        const type = req.body.type;
        const mail = req.body.mail;

        if(type === UserController.AGENCY_TYPE) {

            const name = req.body.name;
            const address = req.body.address;
            const idNumber = req.body.idNumber;
            const phone = req.body.phone;
            const description = req.body.description;

            const newUser = new UserModel({
                username: username,
                password: password,
                type: type,
                status: "PENDING",
                name: req.body.name,
                address: req.body.address,
                idNumber: req.body.idNumber,
                phone: req.body.phone,
                description: req.body.description
            })
        }


    }

}