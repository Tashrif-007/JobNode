import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './routes/auth.routes.js';
import postRouter from './routes/post.routes.js';
import applyRouter from './routes/apply.routes.js';

const app = express();
const PORT = process.env.PORT || 3500;
dotenv.config();
app.use(express.json());
app.use(cors({
    origin: '*',
}));

app.use("/auth", router);
app.use("/post", postRouter);
app.use("/apply", applyRouter);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});