import { Response } from "express";
import { getRepository } from "typeorm";
import { Force } from "../entity/Force";
import { IRequest } from "../interfaces/request";
import { verifiedUser } from "../middleware/auth";
import { CommonRouter } from "./common";

export class ForceRouter extends CommonRouter {
    constructor(baseURL: string) {
        super("ForceRoutes", baseURL);
    }

    configureRoutes() {
        this.router
            .use(verifiedUser)
            .get("/", this.getForceList.bind(this))
            .get("/add", this.addForceView.bind(this))
            .post("/add", this.addForce.bind(this))

    }

    async getForceList(req: IRequest, res: Response) {
        const forces = await getRepository(Force).find();
        return res.render("force/forceList", {forces});
    }

    async addForceView(req: IRequest, res: Response) {
        return res.render("force/addForce");
    }

    async addForce(req: IRequest, res: Response) {
        const {name} = req.body;

        let newForce = new Force();
        newForce.name = name;

        try {
            await getRepository(Force).insert(newForce);
        } catch (error) {
            return res.status(400).render("force/addForce", {
                message: "Force with that name already exists.",
                messageClass: "alert-danger"
            })
        }

        return res.redirect("/force");
    }
}