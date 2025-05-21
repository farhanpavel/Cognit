import {
  getUser,
  getUserByroleFalse,
  getUserByroleTrue,
  makeNotification,
  subscribeTokenToTopic,
  unsubscribeTokenFromTopic,
  userLogin,
  userRegister,
} from "../controllers/userController.js";
import express from "express";
import { jwtAuthentication } from "../middlewares/authMiddleware.js";

const userRouter = express.Router();
userRouter.get("/", getUser);
userRouter.get("/:role/deactive", getUserByroleFalse);
userRouter.get("/:role/:id/active", getUserByroleTrue);
userRouter.post("/subscribe-to-topic", subscribeTokenToTopic);
userRouter.post("/unsubscribe-from-topic", unsubscribeTokenFromTopic);
userRouter.post("/create-notification", makeNotification);

userRouter.post("/login", userLogin);
userRouter.post("/register", userRegister);
userRouter.post("/refresh", userLogin);
userRouter.get("/profile", jwtAuthentication, getUser);

export default userRouter;
