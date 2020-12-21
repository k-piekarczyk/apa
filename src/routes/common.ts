import express from "express";
import debug from "debug";

export abstract class CommonRouter {
    protected router: express.Router;
    protected name: string;
    protected baseURL: string;
    protected debugLog: debug.Debugger;

    constructor(name: string, baseURL: string) {
        this.router = express.Router();
        this.name = name;
        this.baseURL = baseURL;
        this.debugLog = debug(name);
        this.configureRoutes();
    }

    getName(): string {
        return this.name;
    }

    getBaseURL(): string {
        return this.baseURL;
    }

    getRouter(): express.Router {
        return this.router;
    }

    abstract configureRoutes(): void;
}