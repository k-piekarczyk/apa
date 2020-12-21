import { NextFunction, response, Response } from 'express';
import { IRequest } from '../interfaces/request';
import { CommonRouter } from './common'
import { verifiedUser } from '../middleware/auth';

import { User } from '../entity/User';

import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { getRepository } from 'typeorm';
import { AuthToken } from '../entity/AuthToken';

export class AuthRouter extends CommonRouter {
    constructor(baseURL: string) {
        super("AuthRoutes", baseURL);
    }

    configureRoutes() {
        this.router
            .post("/register", this.register.bind(this))
            .post("/login", this.login.bind(this))
            .get("/refresh", verifiedUser, this.refresh.bind(this))
            .get("/logout", verifiedUser, this.logout.bind(this))
    }

    async register(req: IRequest, res: Response) {
        let newUser = new User();
        newUser.username = req.body.username;
        newUser.email = req.body.email;
        newUser.passwordHash = await bcrypt.hash(req.body.password, 10);

        try {
            await getRepository(User).insert(newUser);
        } catch (err) {
            return res.status(400).json({
                message: err.message
            });
        }

        return res.status(200).json({
            message: `Added user ${newUser.username}`
        });
    }



    async login(req: IRequest, res: Response) {
        try {
            const user = await getRepository(User).findOneOrFail({ username: req.body.username });

            if (!await bcrypt.compare(req.body.password, user.passwordHash)) throw new Error("Wrong password!")

            const authToken = new AuthToken();
            authToken.token = crypto.randomBytes(30).toString('hex');
            authToken.user = user;
            authToken.revoked = false;

            await getRepository(AuthToken).insert(authToken);

            res.cookie("AuthToken", authToken.token);
            return res.status(200).json({
                message: "Logged in!",
                data: {
                    username: user.username,
                    email: user.email
                }
            });

        } catch (err) {
            return res.status(400).json({
                message: err.message
            });
        }
    }

    async refresh(req: IRequest, res: Response) {
        return res.status(200).json({
            message: "Logged in!",
            data: {
                username: req.token?.user.username,
                email: req.token?.user.email
            }
        });
    }

    async logout(req: IRequest, res: Response) {
        const token = req.token!;

        token.revoked = true;

        await getRepository(AuthToken).save(token);

        res.cookie("AuthToken", 'delete', {maxAge: 0});
        return res.status(200).json({
            message: "You have been logged out!"
        });
    }
}