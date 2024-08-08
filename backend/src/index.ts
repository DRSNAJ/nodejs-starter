require("dotenv").config();

import express, { NextFunction } from 'express';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import bodyParser from 'body-parser';
import cors from "cors"
import connectToDb from './utils/db'
import { v4 as uuidv4 } from 'uuid';
import {logger, reqLogger} from './utils/logger';

const app = express();

app.use((req, res, next) => {
    req.log = {id: uuidv4()};
    return next();
});

// app.all("*",(req, res, next) => {
//     const reqId = uuidv4();
// });

logger.info("Initializing middleware...");
app.use(cors());
logger.info("CORS enabled.");
app.use(bodyParser.json());
logger.info("JSON body parser enabled.");
app.use(bodyParser.urlencoded({ extended: false }))
logger.info("URL-encoded body parser enabled.");

logger.info("Initializing routes...");
app.use(authRoutes);
logger.info("Auth routes initialized.");
app.use(userRoutes);
logger.info("User routes initialized.");

logger.info("Connecting to the database...");
connectToDb();


  

const envPort = process.env.PORT;
app.listen(envPort, () => logger.info(`Express app listening on port: ${envPort}`));
