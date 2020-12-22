import { NextFunction, response, Response } from 'express';
import { IRequest } from '../interfaces/request';
import { CommonRouter } from './common'
import { checkToken, verifiedUser } from '../middleware/auth';

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
            .get("/register", this.registerView.bind(this))
            .post("/register", this.register.bind(this))
            .get("/login", this.loginView.bind(this))
            .post("/login", this.login.bind(this))
            .get("/logout", verifiedUser, this.logout.bind(this))
            .get("/", checkToken, this.home.bind(this))
    }

    async home(req: IRequest, res: Response) {
        this.debugLog("token: ", req.token)
        if (req.token) return res.render("home")
        else return res.render("home", {layout: 'unverified'});
    }

    async registerView(req: IRequest, res: Response) {
        return res.render("auth/register", {layout: 'unverified'});
    }

    async loginView(req: IRequest, res: Response) {
        return res.render("auth/login", {layout: 'unverified'});
    }

    async register(req: IRequest, res: Response) {
        const { username, password, confirmPassword } = req.body;
        this.debugLog(username, password, confirmPassword);
        if (password !== confirmPassword) {
            return res.status(400).render("auth/register", {
                message: "Password doesn't match.",
                messageClass: "alert-danger",
                layout: 'unverified'
            })
        }

        const userRepo = getRepository(User);


        if (await userRepo.findOne({ username })) {
            return res.status(400).render("auth/register", {
                message: "User already registered.",
                messageClass: "alert-danger",
                layout: 'unverified'
            })
        }

        let newUser = new User();
        newUser.username = username;
        newUser.passwordHash = await bcrypt.hash(password, 10);

        try {
            await getRepository(User).insert(newUser);
        } catch (err) {
            return res.status(400).render("auth/register", {
                message: err.message,
                messageClass: "alert-danger",
                layout: 'unverified'
            });
        }

        return res.status(201).render("auth/login",{
            message: "Registration complete. Please log in to continue.",
            messageClass: "alert-success",
            layout: 'unverified'
        });
    }

    async login(req: IRequest, res: Response) {
        try {
            const user = await getRepository(User).findOneOrFail({ username: req.body.username });

            if (!await bcrypt.compare(req.body.password, user.passwordHash)) throw new Error();

            const authToken = new AuthToken();
            authToken.token = crypto.randomBytes(30).toString('hex');
            authToken.user = user;
            authToken.revoked = false;

            await getRepository(AuthToken).insert(authToken);

            res.cookie("AuthToken", authToken.token);
            return res.redirect("/");

        } catch (err) {
            return res.status(400).render("auth/login", {
                message: "Wrong credentials.",
                messageClass: "alert-danger",
                layout: 'unverified'
            });
        }
    }

    async logout(req: IRequest, res: Response) {
        const token = req.token!;

        token.revoked = true;

        await getRepository(AuthToken).save(token);

        res.cookie("AuthToken", 'delete', { maxAge: 0 });
        return res.redirect("/");
    }
}