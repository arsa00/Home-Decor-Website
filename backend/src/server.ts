import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import userRouter from './routers/user.router';
import path from 'path';
import agencyRouter from './routers/agency.router';

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
router.use("/agency", agencyRouter)
//test
router.get("/", (req, res) => { res.send("Server working..."); });

app.use("/", router);
app.use("/images", express.static(path.join(__dirname, "../assets/images")));   // later maybe expand or shrink scope of static folder accessibility 
app.listen(process.env.PORT || 4005, () => console.log(`Express server running on port ${ process.env.PORT || 4005 }`));