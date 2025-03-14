import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './routes/auth.routes.js';
import postRouter from './routes/post.routes.js';
import applyRouter from './routes/apply.routes.js';
import recRouter from './routes/recommend.routes.js';
import messageRouter from './routes/message.routes.js';
import conversationRouter from './routes/conversation.routes.js';
import {app,server} from "./socket/socket.js";
import offerRouter from './routes/offers.routes.js';
import userRouter from './routes/user.routes.js';
import hireRouter from './routes/hires.routes.js';


const PORT = process.env.PORT || 3500;
dotenv.config();
app.use(express.json());
app.use(cors({
    origin: '*',
}));

app.use("/auth", router);
app.use("/post", postRouter);
app.use("/apply", applyRouter);
app.use("/rec",recRouter);
app.use("/message", messageRouter);
app.use("/conversation", conversationRouter);
app.use("/offer", offerRouter);
app.use("/user", userRouter);
app.use("/hiring", hireRouter);

app.get("*", (req,res) => {
    res.send("JobNode App!");
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});