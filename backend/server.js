import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

const app = express();
const PORT = process.env.PORT || 3500;
dotenv.config();
app.use(express.json());
app.use(cors({
    origin: '*',
}));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});