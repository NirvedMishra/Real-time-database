import { Router } from "express";
import { login, register, logout, verifyUser } from "../controllers/auth.controller.js";
import { verifyUser as verifyUserMiddleware } from "../middleware/auth.middleware.js";

const authRouter = Router();

authRouter.route("/register").post(register);
authRouter.route("/login").post(login);
authRouter.route("/verify").post(verifyUser);
authRouter.route("/logout").post(verifyUserMiddleware,logout);

export default authRouter;