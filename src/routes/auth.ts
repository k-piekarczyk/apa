import { Response } from 'express';
import { IRequest } from '../interfaces/request';
import { CommonRouter } from './common'
import crypto from 'crypto'

export class AuthRouter extends CommonRouter {
    constructor(baseURL: string) {
        super("AuthRoutes", baseURL);
    }

    configureRoutes() {

    }

    async register(req: IRequest, res: Response) {
        
    }

    async login(req: IRequest, res: Response) {

    }

    async logout(req: IRequest, res: Response) {

    }
}