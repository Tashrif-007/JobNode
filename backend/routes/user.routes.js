import express from 'express';
import { getUser, updateProfile } from '../controllers/user.controller.js';

const userRouter = express.Router();

userRouter.put("/update/:userId", updateProfile);

userRouter.get("/getUser/:userId", getUser)

export default userRouter;