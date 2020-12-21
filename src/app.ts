import "reflect-metadata"; // Needed for typeORM to work properly
import express from "express";
import {env} from "process";

import * as bodyparser from "body-parser";

import debug from "debug";
import * as winston from "winston";
import * as expressWinston from "express-winston";
import cors from "cors";

import { CommonRouter } from "./routes/common";
import { AuthRouter } from "./routes/auth";
import { Connection } from "typeorm";
import { createTypeORMConnection, injectTypeORMConnection } from "./db";



export async function initializeApp(): Promise<express.Application> {
    const app: express.Application = express();
    const debugLog: debug.IDebugger = debug("app");

    app.use(bodyparser.json());
    app.use(cors());

    const dbConnection: Connection = await createTypeORMConnection();

    if (env.DEBUG) {
        const { Direction, Flags, Format, TypeormUml } = require('typeorm-uml');
        const flags: typeof Flags = {
            direction: Direction.LR,
            format: Format.SVG
        };
    
        const typeormUml = new TypeormUml();
        const url = await typeormUml.build( dbConnection, flags );
        debugLog( "Diagram URL: " + url);
    }
    
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

    return app;
}