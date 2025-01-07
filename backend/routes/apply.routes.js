import express from 'express';
import { applyToPost, getApplicationsById } from '../controllers/apply.controller.js';
import { upload } from '../middlewares/multer.js';
const applyRouter = express.Router();

applyRouter.post("/applyToPost/:id", upload.single("cv"), applyToPost);

applyRouter.get("/getApplicationsById/:userId", getApplicationsById);
export default applyRouter;