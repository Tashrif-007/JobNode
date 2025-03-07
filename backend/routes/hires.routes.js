import express from 'express';
import { getHires, hire } from '../controllers/hires.controller.js';

const hireRouter = express.Router();

hireRouter.post("/hire", hire);

hireRouter.get("/getHires/:companyId", getHires);

export default hireRouter;