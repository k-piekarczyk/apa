import { CommonRouter } from "./common";
import express from "express";

export class TestRouter extends CommonRouter {
    constructor(baseURL: string) {
        super(express.Router(), "TestRouter", baseURL)
    }

    configureRoutes(): void {
        this.router
            .get("/", this.test);
    }

    async test(req: express.Request, res: express.Response): Promise<void> {
        res.status(500).send("Is not fine :c");
    }
}