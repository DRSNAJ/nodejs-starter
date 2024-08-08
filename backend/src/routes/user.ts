require("dotenv").config();

import express, { NextFunction , Request, Response } from 'express';
import UserModel from '../model';
import { Strategy as JwtStrategy, StrategyOptions } from 'passport-jwt';
import { ExtractJwt as ExtractJwt } from 'passport-jwt';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import {logger, reqLogger} from '../utils/logger';


const router = express.Router();

// router.use((req, res, next) => {
//     console.log('User router middleware');
//     next();
// });

const opts: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET || 'secret',
    passReqToCallback: true,
}

passport.use(new JwtStrategy(opts, async (req ,jwt_payload, done) => {
    const userId = jwt_payload.userId;

    const foundUser = await UserModel.findOne({ user_id: userId });
    if (foundUser) {
        return done(null, foundUser);
    } else {
        reqLogger.error(req.log.id,'User not found in the database');
        return done(null, false, { message: 'User not found' });
    }
}));

type userType = {
    username: String,
    password: String,
    user_id: String,
}

export interface CustomRequest extends Request {
    userId: String;
}

function matchValidUserId(req: Request, res: Response, next: NextFunction) {
    const reqUser = req.user as userType;

    const reqId = req.log?.id||'';

    if (reqUser.user_id === req.params.userId) {
        reqLogger.info(reqId,`Authorized user ${reqUser.user_id}`);
        return next();
    } else {
        reqLogger.warn(reqId,`Unauthorized access attempt by user ${reqUser.user_id} to user ${req.params.userId}`);
        res.statusCode = 401;
        res.send("You are not authorized to edit this user");
    }
}

router.get("/user/:userId", passport.authenticate('jwt', { session: false }), matchValidUserId, async (req, res) => {
    const reqId = req.log?.id||'';
    const authUser = new UserModel(req.user);
    const user = await UserModel.findOne({ user_id: req.params.userId });
    res.json(user);
});

router.put("/user/:userId", passport.authenticate('jwt', { session: false }), matchValidUserId, async (req, res) => {
    const reqUser = new UserModel(req.body);
    const authUser = new UserModel(req.user);

    const reqId = req.log?.id||'';

    reqLogger.info(reqId,`Authorized user ${authUser.user_id} is updating user ${req.params.userId}`);
    try {
        await reqUser.hashPassword();
        const replacedUser = await UserModel.replaceOne({ user_id: req.params.userId }, {
            "username": reqUser.username,
            "password": reqUser.password,
            "user_id": req.params.userId,
        });

        if (!(replacedUser.matchedCount && replacedUser.modifiedCount)) {
            reqLogger.error(reqId,`User ${req.params.userId} not found for update`);
            res.statusCode = 404;
            res.send('User Not Found');
        }
        else {
            reqLogger.info(reqId,`User ${req.params.userId} successfully updated`);
            res.send("User Successfully Updated");
        }
    
    } catch (error) {
        reqLogger.error(reqId,`Error updating user ${req.params.userId}`);
        res.statusCode = 500;
        res.send('Internal Server Error');
    }
});

export default router;
