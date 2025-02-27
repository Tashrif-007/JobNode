import express from 'express';
import { getMessages, sendMessage } from '../controllers/message.controller.js';

const messageRouter = express.Router();

messageRouter.post("/send/:id", sendMessage);

messageRouter.get("/get/:id", getMessages);

export default messageRouter;