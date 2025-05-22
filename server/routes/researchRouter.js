import express from "express";
import { jwtAuthentication } from "../middlewares/authMiddleware.js";
import {
  createMeeting,
  getMeeting,
  updateMeeting,
} from "../controllers/researchController.js";

const researchRouter = express.Router();

researchRouter.use(jwtAuthentication);

// Meeting routes
researchRouter.post("/meetings", createMeeting);
researchRouter.put("/meetings", updateMeeting);

researchRouter.get("/", getMeeting);

export default researchRouter;
