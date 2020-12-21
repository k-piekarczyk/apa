import "reflect-metadata"; // Needed for typeORM to work properly
import express from "express";

import * as bodyparser from "body-parser";

import debug from "debug";
import * as winston from "winston";
import * as expressWinston from "express-winston";
import cors from "cors";

import { CommonRouter } from "./routes/common";
import { TestRouter } from "./routes/test";
import { Connection } from "typeorm";
import { createTypeORMConnection, injectTypeORMConnection } from "./db";

export async function initializeApp(): Promise<express.Application> {
    const app: express.Application = express();
    const debugLog: debug.IDebugger = debug("app");

    app.use(bodyparser.json());
    app.use(cors());

    const dbConnection: Connection = await createTypeORMConnection();
    app.use(injectTypeORMConnection(dbConnection));

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
        new TestRouter("/test")
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

    return app;
}