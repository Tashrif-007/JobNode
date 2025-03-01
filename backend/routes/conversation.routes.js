import express from 'express';
import { createConversation, getConversations } from '../controllers/conversation.controller.js';

const router = express.Router();

router.get("/getConversations/:id", getConversations);

router.post("/createConversation", createConversation);

export default router;