require("dotenv").config();

import express from 'express';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import bodyParser from 'body-parser';
import cors from "cors"
import connectToDb from './utils/db'

const app = express();

console.log("Initializing middleware...");
app.use(cors());
console.log("CORS enabled.");
app.use(bodyParser.json());
console.log("JSON body parser enabled.");
app.use(bodyParser.urlencoded({ extended: false }))
console.log("URL-encoded body parser enabled.");

console.log("Initializing routes...");
app.use(authRoutes);
console.log("Auth routes initialized.");
app.use(userRoutes);
console.log("User routes initialized.");

console.log("Connecting to the database...");
connectToDb();

const envPort = process.env.PORT;
app.listen(envPort, () => console.log(`Express app listening on port: ${envPort}`));
