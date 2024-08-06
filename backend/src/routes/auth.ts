require("dotenv").config();

import express from 'express';
import UserModel from '../model';
import { Strategy as JwtStrategy } from 'passport-jwt';
import { ExtractJwt as ExtractJwt } from 'passport-jwt';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const router = express.Router();

type userType = {
    username: String,
    password: String,
}

async function createJwt(userId:String) {
    const token = await jwt.sign({userId:userId}, process.env.JWT_SECRET || 'secret');
    return token
}

router.get("/", (req, res) => res.send("Hello World!"));

router.post("/signup", async (req, res) => {
    try {
        const newUser: userType = req.body;
        const addUser = new UserModel(newUser);
        await addUser.hashPassword();
        await addUser.save();   
        console.log(`New user: ${newUser.username} successfully added.`);
        // await addUser.verifyPassword(newUser.password);
        const token = await createJwt(addUser.user_id);
        res.json({token});
        // res.send(`User: ${newUser.username} added.`);

    } catch (error) {
        console.error(error);
        res.status(422);
        res.send(`Error`);
    }
});

router.post("/login", async (req, res) => {

    const reqUser: userType = req.body;

    try {
        let selectedUser = await UserModel.findOne({"username": reqUser.username});

        if (!!selectedUser){
            selectedUser = new UserModel(selectedUser);
            console.log(selectedUser);

            if (await selectedUser.verifyPassword(reqUser.password)){
                const token = await createJwt(selectedUser.user_id);
                res.statusMessage = "Authorized";
                res.json({token});
            } else {
                res.statusCode = 401;
                res.statusMessage = "Unauthorized";
                res.send("Invalid Password");
            }
        } else {
            res.statusCode = 404;
            res.send("User Not Found");
        }
    
    } catch (error) {
        console.error(error);
        res.statusCode = 500;
        res.send("Internal Server Error");
    }



});

export default router;

