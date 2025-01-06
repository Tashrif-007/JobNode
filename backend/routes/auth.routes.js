import express from 'express';
import { register, login, sendMail, resetPassword ,getUserById} from '../controllers/auth.controller.js';
const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.post("/sendResetMail", sendMail);

router.post("/resetPassword", resetPassword);

router.get("/getUserById/:id",getUserById);

export default router;