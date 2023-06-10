import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import userRouter from './routers/user.router';

const app = express();

app.use(cors());
app.use(express.json());

require('dotenv').config();

mongoose.connect(process.env.MONGO_DB);

const connection = mongoose.connection;
connection.once("open", () => {
    console.log("DB connected");
})

const router = express.Router();
router.use("/user", userRouter);
router.get("/", (req, res) => { res.send("Server working..."); });

app.use("/", router);
app.listen(process.env.PORT || 4005, () => console.log(`Express server running on port ${ process.env.PORT || 4005 }`));