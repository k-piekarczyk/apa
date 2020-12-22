import { Response } from "express";
import { getRepository } from "typeorm";
import { Wargear } from "../entity/Wargear";
import { IRequest } from "../interfaces/request";
import { verifiedUser } from "../middleware/auth";
import { CommonRouter } from "./common";

export class WargearRouter extends CommonRouter {
    constructor(baseURL: string) {
        super("WargearRouter", baseURL);
    }

    configureRoutes() {
        this.router
            .use(verifiedUser)
            .get("/", this.wargearList.bind(this))
            .get("/add", this.addWargearView.bind(this))
            .post("/add", this.addWargear.bind(this))
    }

    async wargearList(req: IRequest, res: Response) {
        const wargearList = await getRepository(Wargear).find();
        return res.render("wargear/listWargear", {wargearList});
    }

    async addWargearView(req: IRequest, res: Response) {
        return res.render("wargear/addWargear");
    }

    async addWargear(req: IRequest, res: Response) {
        const {name, type, pointValue} = req.body;

        let newWargear = new Wargear();
        newWargear.name = name;
        newWargear.type = type;
        newWargear.pointValue = pointValue;

        
    }
}