import express from "express";
import { jwtAuthentication } from "../middlewares/authMiddleware.js";
import {
  createMeeting,
  getMeeting,
  updateMeeting,
  getResearches,
  enrollResearch,
  getResearchById,
  getMyEndrollments,
} from "../controllers/researchController.js";

const researchRouter = express.Router();


// Meeting routes
researchRouter.post("/meetings", jwtAuthentication, createMeeting);
researchRouter.put("/meetings", jwtAuthentication, updateMeeting);

researchRouter.get("/", getMeeting);
researchRouter.get("/get/all", getResearches);
researchRouter.get("/enroll/:id", jwtAuthentication, enrollResearch);
researchRouter.get("/get/:id", jwtAuthentication, getResearchById);
researchRouter.get("/get/myendrollments/all", jwtAuthentication, getMyEndrollments);

export default researchRouter;
