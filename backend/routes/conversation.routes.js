import express from 'express';
import { getConversations } from '../controllers/conversation.controller.js';

const router = express.Router();

router.get("/getConversations/:id", getConversations);

export default router;