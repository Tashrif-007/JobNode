import express from 'express';
import { createPost, getAllPost, getPostById } from '../controllers/post.controller.js';

const postRouter = express.Router();

postRouter.post("/createPost", createPost);

postRouter.get("/getAllPosts", getAllPost);

postRouter.get("/getPostById/:id", getPostById);

export default postRouter;