import { Response } from 'express';
import { IRequest } from '../interfaces/request';
import { CommonRouter } from './common'
import { verifiedUser } from '../middleware/auth';
import crypto from 'crypto'

export class AuthRouter extends CommonRouter {
    constructor(baseURL: string) {
        super("AuthRoutes", baseURL);
    }

    configureRoutes() {
        this.router
            .post("/register", this.register)
            .post("/login", this.login)
            .get("/refresh", verifiedUser, this.refreshLogin)
            .post("/logout", verifiedUser, this.logout);
    }

    async register(req: IRequest, res: Response) {
        
    }

    async login(req: IRequest, res: Response) {

    }

    async refreshLogin(req: IRequest, res: Response) {

    }

    async logout(req: IRequest, res: Response) {

    }
}