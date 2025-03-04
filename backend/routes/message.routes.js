import express from 'express';
import { deleteMessage, getMessages, sendMessage } from '../controllers/message.controller.js';

const messageRouter = express.Router();

messageRouter.post("/send/:id", sendMessage);

messageRouter.get("/getMessages/:id", getMessages);

messageRouter.delete("/delete/:messageId", deleteMessage);

export default messageRouter;