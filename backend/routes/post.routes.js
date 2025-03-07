import express from 'express';
import { createPost, deleteJobPost, getAllPosts, getPostById, searchFilteredPosts, searchPosts} from '../controllers/post.controller.js';

const postRouter = express.Router();

postRouter.post("/createPost", createPost);

postRouter.get("/getAllPosts", getAllPosts);

postRouter.get("/getPostById/:id", getPostById);

postRouter.get("/searchPosts",searchPosts);

postRouter.get("/searchFilteredPosts", searchFilteredPosts);

postRouter.delete("/deletePost/:id", deleteJobPost);

export default postRouter;