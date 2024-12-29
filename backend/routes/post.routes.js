import express from 'express';
import { createPost, getAllPost } from '../controllers/post.controller.js';

const postRouter = express.Router();

postRouter.post("/createPost", createPost);

postRouter.get("/getAllPosts", getAllPost);

export default postRouter;