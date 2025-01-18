import express from 'express';
import { applyToPost, getApplicationsByCompany, getApplicationsById } from '../controllers/apply.controller.js';
import { upload } from '../middlewares/multer.js';
const applyRouter = express.Router();

applyRouter.post("/applyToPost/:id", upload.single("cv"), applyToPost);

applyRouter.get("/getApplicationsById/:userId", getApplicationsById);
applyRouter.get("/getApplicationByCompany/:companyId",getApplicationsByCompany)
export default applyRouter;