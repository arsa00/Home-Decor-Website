import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import userRouter from './routers/user.router';

const PORT: number = 4000;

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/test");

const connection = mongoose.connection;
connection.once("open", () => {
    console.log("DB connected");
})

const router = express.Router();
router.use("/user", userRouter);
router.get("/", (req, res) => { res.send("Server working..."); });

app.use("/", router);
app.listen(PORT, () => console.log(`Express server running on port ${ PORT }`));