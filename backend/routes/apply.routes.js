import express from 'express';
import { applicationExists, applyToPost, downloadCV, getApplicationsByCompany, getApplicationsById, updateApplicationStatus } from '../controllers/apply.controller.js';
import { upload } from '../middlewares/multer.js';
const applyRouter = express.Router();

applyRouter.post("/applyToPost/:id", upload.single("cv"), applyToPost);

applyRouter.get("/getApplicationsById/:userId", getApplicationsById);

applyRouter.get("/getApplicationsByCompany/:userId",getApplicationsByCompany);

applyRouter.put("/updateStatus/:applicationId", updateApplicationStatus);

applyRouter.get("/download/:filename", downloadCV);

applyRouter.post("/exists", applicationExists);

export default applyRouter;