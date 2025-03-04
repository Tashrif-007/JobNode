import express from 'express';
import { createConversation, deleteConversation, getConversations } from '../controllers/conversation.controller.js';

const router = express.Router();

router.get("/getConversations/:id", getConversations);

router.post("/createConversation", createConversation);

router.delete("/delete/:conversationId", deleteConversation);

export default router;