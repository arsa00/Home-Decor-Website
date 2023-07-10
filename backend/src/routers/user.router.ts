import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import path from "path";
import { JwtAuth } from "../middlewares/jwt-auth";

const fs = require("fs");
const multer = require('multer');
const userRouter = Router();

userRouter.route("/login").post(
    (req, res) => new UserController().login(req, res)
);


userRouter.route("/register").post(
    (req, res) => new UserController().register(req, res)
);


const imgStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        const userFolder = path.join(__dirname, "../../assets/images/" + req.body.username);

        // create user's folder in assets/images/, if it doesn't already exist
        if (!fs.existsSync(userFolder)){
            fs.mkdirSync(userFolder);
        }

        callback(null, userFolder);
    },
    filename: (req, file, callback) => {
        callback(null, "profileImg" + path.extname(file.originalname));
    }
});

const uploadProfileImg = multer({ storage: imgStorage });

userRouter.route("/uploadProfileImg").post(uploadProfileImg.single("profileImg"), 
    (req, res, next) => new UserController().profileImgUpload(req, res, next)
);


userRouter.route("/generateRecoveryLink").post(
    (req, res) => new UserController().generateRecoveryLink(req, res)
);


userRouter.route("/resetPassword").post(
    (req, res) => new UserController().resetPassword(req, res)
);


userRouter.route("/updateData").post(
    (req, res, next) => new JwtAuth().postValidateJwt(req, res, next),
    (req, res) => new UserController().updateData(req, res)
);


userRouter.route("/changePassword").post(
    (req, res, next) => new JwtAuth().postValidateJwt(req, res, next),
    (req, res) => new UserController().changePassword(req, res)
);


userRouter.route("/getNumberOfUsers").post(
    (req, res, next) => new JwtAuth().postValidateJwt(req, res, next),
    (req, res) => new UserController().getNumberOfUsers(req, res)
);


userRouter.route("/getNumberOfPendingUsers").post(
    (req, res, next) => new JwtAuth().postValidateJwt(req, res, next),
    (req, res) => new UserController().getNumberOfPendingUsers(req, res)
);


userRouter.route("/getSliceOfUsers").post(
    (req, res, next) => new JwtAuth().postValidateJwtAndAdminType(req, res, next),
    (req, res) => new UserController().getSliceOfUsers(req, res)
);


userRouter.route("/getSliceOfPendingUsers").post(
    (req, res, next) => new JwtAuth().postValidateJwtAndAdminType(req, res, next),
    (req, res) => new UserController().getSliceOfPendingUsers(req, res)
);


userRouter.route("/deleteUserById").post(
    (req, res, next) => new JwtAuth().postValidateJwtAndAdminType(req, res, next),
    (req, res) => new UserController().deleteUserById(req, res)
);


userRouter.route("/acceptRegisterRequest").post(
    (req, res, next) => new JwtAuth().postValidateJwtAndAdminType(req, res, next),
    (req, res) => new UserController().acceptRegisterRequest(req, res)
);


userRouter.route("/rejectRegisterRequest").post(
    (req, res, next) => new JwtAuth().postValidateJwtAndAdminType(req, res, next),
    (req, res) => new UserController().rejectRegisterRequest(req, res)
);

export default userRouter;