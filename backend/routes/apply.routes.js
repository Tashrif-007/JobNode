import express from 'express';
import { applyToPost } from '../controllers/apply.controller.js';

const applyRouter = express.Router();

applyRouter.post("/applyToPost", applyToPost);

export default applyRouter;