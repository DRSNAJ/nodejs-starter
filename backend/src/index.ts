require("dotenv").config();

import express from 'express';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import bodyParser from 'body-parser';
import cors from "cors"
import connectToDb from './utils/db'

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

app.use(authRoutes);
app.use(userRoutes);

connectToDb();

const envPort = process.env.PORT;
app.listen(envPort, ()=> console.log(`Express app listening on port: ${envPort}`));