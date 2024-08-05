require("dotenv").config();

import express from 'express';
import mongoose from 'mongoose';
import UserSchema from './model';

const app = express();

try {
    mongoose.connect(process.env.DB_CONNECTION_STRING!+'/users');
} catch (error) {
    console.log("Unable to connect to database");
}

const UserModel = mongoose.model('user_cred',UserSchema);

app.get("/", (req, res) => res.send("Hello World!"));
// app.get("/:user/messages", (req, res) => {
//     res.status(200).send(req.params.user);
// });

app.post("/api/signup")



const envPort = process.env.PORT;
app.listen(envPort, ()=> console.log(`My first express app listening on port: ${envPort}`));