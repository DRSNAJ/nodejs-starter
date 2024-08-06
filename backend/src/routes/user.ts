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
        const user = await UserModel.findOne({user_id:req.params.userId});
        res.json(user);
    } else {
        res.statusCode = 401;
        res.send("You are not authorized to edit this user");
    }
});

router.put("/user/:userId",  passport.authenticate('jwt', { session: false }), async (req, res) => {
    const reqUser: userType = req.body;
    const authUser = new UserModel(req.user);
    if (authUser.user_id === req.params.userId) {
        
        try {
            const replacedUser = await UserModel.replaceOne({user_id:req.params.userId}, {
                "username": reqUser.username,
                "password": reqUser.password,
                "user_id": req.params.userId,
            });
    
            if (!(replacedUser.matchedCount && replacedUser.modifiedCount)){
                res.statusCode = 404;
                res.send('User Not Found');
            }
            else {
                res.send("User Successfully Updated");
            }
        
        } catch (error) {
            console.error(error)
            res.statusCode = 500;
            res.send('Internal Server Error');
        }

    } else {
        res.statusCode = 401;
        res.send("You are not authorized to view this user");
    }
    // query database based on jwt and update user information based on request
});

export default router;