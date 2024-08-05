require("dotenv").config();

import express from 'express';
import mongoose from 'mongoose';
import UserModel from './model';
import bodyParser from 'body-parser';
import cors from "cors"
import connectToDb from './utils/db'

const app = express();
app.use(cors());
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }))

connectToDb();

type userType = {
    username: String,
    password: String,
}

app.get("/", (req, res) => res.send("Hello World!"));
// app.get("/:user/messages", (req, res) => {
//     res.status(200).send(req.params.user);
// })

app.post("/api/signup", async (req, res) => {
    try {
        const newUser: userType = req.body;
        const addUser = new UserModel(newUser);
        await addUser.hashPassword();
        await addUser.save();   
        console.log(`New user: ${newUser.username} successfully added.`);
        // await addUser.verifyPassword(newUser.password);
        res.send(`User: ${newUser.username} added.`);

    } catch (error) {
        console.error(error);
        res.status(422);
        res.send(`Error`);
    }
});

const envPort = process.env.PORT;
app.listen(envPort, ()=> console.log(`Express app listening on port: ${envPort}`));