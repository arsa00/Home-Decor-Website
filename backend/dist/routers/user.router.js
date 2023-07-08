"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const path_1 = __importDefault(require("path"));
const fs = require("fs");
const multer = require('multer');
const userRouter = (0, express_1.Router)();
userRouter.route("/login").post((req, res) => new user_controller_1.UserController().login(req, res));
userRouter.route("/register").post((req, res) => new user_controller_1.UserController().register(req, res));
const imgStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        const userFolder = path_1.default.join(__dirname, "../../assets/images/" + req.body.username);
        // create user's folder in assets/images/, if it doesn't already exist
        if (!fs.existsSync(userFolder)) {
            fs.mkdirSync(userFolder);
        }
        callback(null, userFolder);
    },
    filename: (req, file, callback) => {
        callback(null, "profileImg" + path_1.default.extname(file.originalname));
    }
});
const uploadProfileImg = multer({ storage: imgStorage });
userRouter.route("/uploadProfileImg").post(uploadProfileImg.single("profileImg"), (req, res, next) => new user_controller_1.UserController().profileImgUpload(req, res, next));
userRouter.route("/generateRecoveryLink").post((req, res) => new user_controller_1.UserController().generateRecoveryLink(req, res));
userRouter.route("/resetPassword").post((req, res) => new user_controller_1.UserController().resetPassword(req, res));
userRouter.route("/updateData").post((req, res) => new user_controller_1.UserController().updateData(req, res));
userRouter.route("/changePassword").post((req, res) => new user_controller_1.UserController().changePassword(req, res));
userRouter.route("/getNumberOfUsers").post((req, res) => new user_controller_1.UserController().getNumberOfUsers(req, res));
userRouter.route("/getNumberOfPendingUsers").post((req, res) => new user_controller_1.UserController().getNumberOfPendingUsers(req, res));
userRouter.route("/getSliceOfUsers").post((req, res) => new user_controller_1.UserController().getSliceOfUsers(req, res));
userRouter.route("/getSliceOfPendingUsers").post((req, res) => new user_controller_1.UserController().getSliceOfPendingUsers(req, res));
userRouter.route("/deleteUserById").post((req, res) => new user_controller_1.UserController().deleteUserById(req, res));
userRouter.route("/acceptRegisterRequest").post((req, res) => new user_controller_1.UserController().acceptRegisterRequest(req, res));
userRouter.route("/rejectRegisterRequest").post((req, res) => new user_controller_1.UserController().rejectRegisterRequest(req, res));
exports.default = userRouter;
//# sourceMappingURL=user.router.js.map