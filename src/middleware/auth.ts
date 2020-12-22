import { Response, NextFunction } from "express"
import { getRepository } from "typeorm";
import { AuthToken } from "../entity/AuthToken";
import { User } from "../entity/User";
import { IRequest } from "../interfaces/request"
import debug from "debug";

const debugLogVU = debug("AuthMiddleware:verifiedUser");
const debugLogCT = debug("AuthMiddleware:checkToken");

export async function verifiedUser(req: IRequest, res: Response, next: NextFunction) {
    try {
        const token = await getRepository(AuthToken).findOneOrFail({token: req.cookies["AuthToken"], revoked: false},{relations: ["user"]});
        req.token = token;
        next();

    } catch (err) {
        debugLogVU(err.message);
        return res.status(403).render("notLoggedIn", {
            layout: "unverified"
        });
    }
}

export async function checkToken(req: IRequest, res: Response, next: NextFunction) {
    try {
        const token = await getRepository(AuthToken).findOneOrFail({token: req.cookies["AuthToken"], revoked: false},{relations: ["user"]});
        req.token = token;
        next();

    } catch (err) {
        debugLogCT(err.message);
        next();
    }
}