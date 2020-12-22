import "reflect-metadata"; // Needed for typeORM to work properly
import express from "express";
import { env } from "process";

import * as bodyParser from "body-parser";

import debug from "debug";
import * as winston from "winston";
import * as expressWinston from "express-winston";
import cors from "cors";
import cookieParser from "cookie-parser";
import handlebars from "express-handlebars";

import { CommonRouter } from "./routes/common";
import { AuthRouter } from "./routes/auth";
import { Connection, createConnection, getConnection } from "typeorm";
import { PaintRouter } from "./routes/paint";
import { incjectSession } from "./middleware/injectSession";
import { ForceRouter } from "./routes/force";

createConnection().then(async () => {
    const app: express.Application = express();
    const debugLog: debug.IDebugger = debug("app");

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use(cors());

    app.use(incjectSession);
    
    app.set("view engine", "hbs");
    app.engine("hbs", handlebars({
        extname: ".hbs",
        layoutsDir: __dirname + "/../views/layouts",
        defaultLayout: "main"
    }));

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
        new AuthRouter("/"),
        new PaintRouter("/paint"),
        new ForceRouter("/force")
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