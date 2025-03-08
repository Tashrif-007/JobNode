import express from 'express';
import { fetchJobPost, getRecommendedJobs } from '../controllers/recommend.controller.js';

const recRouter = express.Router();

recRouter.get("/recommend/:jobSeekerId", getRecommendedJobs);

recRouter.get("/getJobPost/:postId", fetchJobPost)
export default recRouter;