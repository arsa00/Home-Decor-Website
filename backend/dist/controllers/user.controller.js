"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_1 = require("../models/user");
class UserController {
    constructor() {
        this.login = (req, res) => {
            const username = req.body.username;
            const password = req.body.password;
            user_1.UserModel.findOne({ 'username': username }, (err, user) => {
                if (err) {
                    return res.json({ errMsg: "Došlo je do greške. Pokušajte ponovo." });
                }
                else {
                    if (!user) {
                        return res.json({ errMsg: "Pogrešno korisničko ime" });
                    }
                    if (user.password === password) {
                        // generate JWT
                        return res.json(user);
                    }
                    else {
                        return res.json({ errMsg: "Pogrešna lozinka" });
                    }
                }
            });
        };
    }
}
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map