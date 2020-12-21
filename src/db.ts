import { NextFunction, Request, Response } from "express";
import { Connection, createConnection } from "typeorm";

import { Army } from "./entity/Army";
import { Force } from "./entity/Force";
import { Paint } from "./entity/Paint";
import { PaintScheme } from "./entity/PaintScheme";
import { PaintSchemePart } from "./entity/PaintSchemePart";
import { Unit } from "./entity/Unit";
import { UnitVariant } from "./entity/UnitVariant";
import { User } from "./entity/User";
import { Wargear } from "./entity/Wargear";
import { WargearVariant } from "./entity/WargearVariant";

import { IRequest } from "./interfaces/request"

export async function createTypeORMConnection(): Promise<Connection> {
    return await createConnection({
        type: "postgres",
        host: "localhost",
        port: 3002,
        username: "dbuser",
        password: "dbpass",
        database: "apa",
        entities: [
            Army,
            Force,
            Paint,
            PaintScheme,
            PaintSchemePart,
            Unit,
            UnitVariant,
            User,
            Wargear,
            WargearVariant
        ],
        synchronize: true,
        logging: true,
    });
}

export function injectTypeORMConnection(connection: Connection) {
    return function injectTypeORMConnectionMiddleware(req: IRequest, res: Response, next: NextFunction) {
        req.db = connection;
        next();
    }
}