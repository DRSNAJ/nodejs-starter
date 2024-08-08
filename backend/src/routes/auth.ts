require("dotenv").config();

import express from 'express';
import UserModel from '../model';
import { Strategy as JwtStrategy } from 'passport-jwt';
import { ExtractJwt as ExtractJwt } from 'passport-jwt';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import {reqLogger} from '../utils/logger';

const router = express.Router();

type userType = {
    username: String,
    password: String,
}

async function createJwt(userId: String) {
    const token = await jwt.sign({ userId: userId }, process.env.JWT_SECRET || 'secret');
    return token;
}

router.get("/", (req, res) => res.send("Hello World!"));

router.post("/signup", async (req, res) => {
    const reqId = req.log?.id || '';
    try {
        const newUser: userType = req.body;
        const addUser = new UserModel(newUser);
        await addUser.hashPassword();
        await addUser.save();
        reqLogger.info(reqId,`New user: ${newUser.username} successfully added.`);
        const token = await createJwt(addUser.user_id);
        res.json({ token });
    } catch (error) {
        reqLogger.error(reqId,`Error adding user: ${error}`);
        res.status(422);
        res.send("Error adding user");
    }
});

router.post("/login", async (req, res) => {
    const reqUser: userType = req.body;

    const reqId = req.log?.id || '';

    try {
        let selectedUser = await UserModel.findOne({ "username": reqUser.username });

        if (!!selectedUser) {
            selectedUser = new UserModel(selectedUser);
            reqLogger.info(reqId, `User found: ${selectedUser.username}`);

            if (await selectedUser.verifyPassword(reqUser.password)) {
                const token = await createJwt(selectedUser.user_id);
                res.statusMessage = "Authorized";
                res.json({ token });
                reqLogger.info(reqId, `User ${selectedUser.username} authorized successfully.`);
            } else {
                res.statusCode = 401;
                res.statusMessage = "Unauthorized";
                res.send("Invalid Password");
                reqLogger.warn(reqId, `Failed login attempt for user ${selectedUser.username}: Invalid Password.`);
            }
        } else {
            res.statusCode = 404;
            res.send("User Not Found");
            reqLogger.error(reqId, `Failed login attempt: User ${reqUser.username} not found.`);
        }

    } catch (error) {
        res.statusCode = 500;
        res.send("Internal Server Error");
        reqLogger.error(reqId, `Error during login process: ${error}`);
    }
});

export default router;
