import { Response, NextFunction } from "express"
import { getRepository } from "typeorm";
import { AuthToken } from "../entity/AuthToken";
import { User } from "../entity/User";
import { IRequest } from "../interfaces/request"

export async function incjectSession(req: IRequest, res: Response, next: NextFunction) {
    req.session = {};
    next()
}