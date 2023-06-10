"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const userRouter = (0, express_1.Router)();
userRouter.route("/login").post((req, res) => new user_controller_1.UserController().login(req, res));
exports.default = userRouter;
//# sourceMappingURL=user.router.js.map