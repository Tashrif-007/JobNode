import express from 'express';
import { getUser, updateCompanyProfile, updateProfile } from '../controllers/user.controller.js';

const userRouter = express.Router();

userRouter.put("/update/:userId", updateProfile);

userRouter.put("/updateCompany/:userId", updateCompanyProfile);

userRouter.post("/getUser/:userId", getUser)

export default userRouter;