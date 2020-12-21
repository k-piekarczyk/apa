import { Request } from "express";
import { Connection } from "typeorm";

export interface IRequest extends Request {
    db?: Connection;
}