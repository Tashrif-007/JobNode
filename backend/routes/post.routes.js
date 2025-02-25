import express from 'express';
import { createPost, getAllPosts, getPostById, searchPosts} from '../controllers/post.controller.js';

const postRouter = express.Router();

postRouter.post("/createPost", createPost);

postRouter.get("/getAllPosts", getAllPosts);

postRouter.get("/getPostById/:id", getPostById);

postRouter.get("/searchPosts",searchPosts);

export default postRouter;