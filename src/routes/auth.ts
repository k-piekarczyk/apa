import { NextFunction, Response } from 'express';
import { IRequest } from '../interfaces/request';
import { CommonRouter } from './common'
import { verifiedUser } from '../middleware/auth';

import { User } from '../entity/User';

import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { getRepository } from 'typeorm';

export class AuthRouter extends CommonRouter {
    constructor(baseURL: string) {
        super("AuthRoutes", baseURL);
    }

    configureRoutes() {
        this.router.post("/register", async (req: IRequest, res: Response) => {
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
            });

        this.router.post("/login", async (req: IRequest, res: Response) => {
            try {
                const user = await getRepository(User).findOneOrFail({username: req.body.username});

                if (!await bcrypt.compare(req.body.password, user.passwordHash)) throw new Error("Wrong password!")

                
            } catch (err) {
                return res.status(400).json({
                    message: err.message
                });
            }

            return res.status(200)
        });

        this.router.get("/refresh", verifiedUser, async (req: IRequest, res: Response) => { });

        this.router.post("/logout", verifiedUser, async (req: IRequest, res: Response) => { });
    }
}