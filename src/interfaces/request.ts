import { Request } from "express";
import { AuthToken } from "../entity/AuthToken";

export interface IRequest extends Request {
    token?: AuthToken;
    session?: any
}