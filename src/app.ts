import "reflect-metadata"; // Needed for typeORM to work properly
import express from "express";
import { env } from "process";

import * as bodyparser from "body-parser";

import debug from "debug";
import * as winston from "winston";
import * as expressWinston from "express-winston";
import cors from "cors";
import cookieParser from "cookie-parser";

import { CommonRouter } from "./routes/common";
import { AuthRouter } from "./routes/auth";
import { Connection, createConnection, getConnection } from "typeorm";

createConnection().then(async () => {
    const app: express.Application = express();
    const debugLog: debug.IDebugger = debug("app");

    app.use(bodyparser.json());
    app.use(cookieParser());
    app.use(cors());

    app.use(expressWinston.logger({
        transports: [
            new winston.transports.Console()
        ],
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.json()
        )
    }));

    const routes: Array<CommonRouter> = [
        new AuthRouter("/")
    ];

    routes.forEach((router: CommonRouter) => {
        app.use(router.getBaseURL(), router.getRouter())
        debugLog(`${router.getName()} attached to ${router.getBaseURL()}`)
    });

    app.use(expressWinston.errorLogger({
        transports: [
            new winston.transports.Console()
        ],
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.json()
        )
    }));

    app.listen(3000, () => {
        debugLog(`Server running at http://localhost:${3000}`);
    })
}).catch(error => console.log(error));