import { Router } from "express";
import { registerDB, giveRealTimeUpdates,deleteDB } from "../controllers/db.controller.js";
import { verifyUser as verifyUserMiddleware } from "../middleware/auth.middleware.js";

const authRouter = Router();

authRouter.route("/registerDB").post(verifyUserMiddleware,registerDB);
authRouter.route("/giveDB").get(verifyUserMiddleware,giveRealTimeUpdates);
authRouter.route("/deleteDB").patch(verifyUserMiddleware,deleteDB);

export default authRouter;