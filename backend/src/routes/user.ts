require("dotenv").config();

import express, { NextFunction } from 'express';
import UserModel from '../model';
import { Strategy as JwtStrategy } from 'passport-jwt';
import { ExtractJwt as ExtractJwt } from 'passport-jwt';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const router = express.Router();

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET || 'secret',
}

passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
    const userId = jwt_payload.userId;

    const foundUser = await UserModel.findOne({ user_id: userId });
    if (foundUser) {
        return done(null, foundUser);
    } else {
        console.log('User not found in the database');
        return done(null, false, { message: 'User not found' });
    }
}));

type userType = {
    username: String,
    password: String,
    userId: String,
}

// interface customRequest extends Request {
//     user: {user_id: String};
// }

// function matchValidUserId(req: customRequest, res: Response, next: NextFunction) {
//     console.log(req.user.user_id);
//     return next();
// }

router.get("/user/:userId", passport.authenticate('jwt', { session: false }), async (req, res) => {
    const authUser = new UserModel(req.user);
    if (authUser.user_id === req.params.userId) {
        console.log(`Authorized user ${authUser.user_id}`);
        const user = await UserModel.findOne({ user_id: req.params.userId });
        res.json(user);
    } else {
        console.log(`Unauthorized access attempt by user ${authUser.user_id} to user ${req.params.userId}`);
        res.statusCode = 401;
        res.send("You are not authorized to edit this user");
    }
});

router.put("/user/:userId", passport.authenticate('jwt', { session: false }), async (req, res) => {
    // const reqUser: userType = req.body;
    const reqUser = new UserModel(req.body);
    const authUser = new UserModel(req.user);
    
    if (authUser.user_id === req.params.userId) {
        console.log(`Authorized user ${authUser.user_id} is updating user ${req.params.userId}`);
        try {
            await reqUser.hashPassword();
            const replacedUser = await UserModel.replaceOne({ user_id: req.params.userId }, {
                "username": reqUser.username,
                "password": reqUser.password,
                "user_id": req.params.userId,
            });
    
            if (!(replacedUser.matchedCount && replacedUser.modifiedCount)) {
                console.log(`User ${req.params.userId} not found for update`);
                res.statusCode = 404;
                res.send('User Not Found');
            }
            else {
                console.log(`User ${req.params.userId} successfully updated`);
                res.send("User Successfully Updated");
            }
        
        } catch (error) {
            console.error(`Error updating user ${req.params.userId}:`, error);
            res.statusCode = 500;
            res.send('Internal Server Error');
        }
    } else {
        console.log(`Unauthorized update attempt by user ${authUser.user_id} to user ${req.params.userId}`);
        res.statusCode = 401;
        res.send("You are not authorized to view this user");
    }
});

export default router;
