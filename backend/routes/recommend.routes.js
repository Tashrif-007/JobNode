import express from 'express';
import { getRecommendedJobs } from '../controllers/recommend.controller.js';

const recRouter = express.Router();

recRouter.get("/recommend/:jobSeekerId", getRecommendedJobs);

export default recRouter;