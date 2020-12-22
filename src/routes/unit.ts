import { Response } from "express";
import { getRepository } from "typeorm";
import { RelationLoader } from "typeorm/query-builder/RelationLoader";
import { Force } from "../entity/Force";
import { Unit } from "../entity/Unit";
import { IRequest } from "../interfaces/request";
import { verifiedUser } from "../middleware/auth";
import { CommonRouter } from "./common";

export class UnitRouter extends CommonRouter {
    constructor(baseURL: string) {
        super("UnitRouter", baseURL);
    }

    configureRoutes() {
        this.router
            .use(verifiedUser)
            .get("/", this.unitList.bind(this))
            .get("/add", this.addUnitView.bind(this))
            .post("/add", this.addUnit.bind(this))
    }

    async unitList(req: IRequest, res: Response) {
        const units = await getRepository(Unit).find();
        return res.render("unit/listUnit", {units});
    }

    async addUnitView(req: IRequest, res: Response) {
        const forces = await getRepository(Force).find()
        return res.render("unit/addUnit", {forces});
    }

    async addUnit(req: IRequest, res: Response) {
        const {name, forceName, type, minPerUnit, maxPerUnit, pointsPerModel} = req.body;

        let newUnit = new Unit();
        newUnit.name = name;
        newUnit.force = await getRepository(Force).findOne({name: forceName});
        newUnit.type = type;
        newUnit.minModelsPerUnit = minPerUnit;
        newUnit.maxModelsPerUnit = maxPerUnit;
        newUnit.pointsPerModel = pointsPerModel;

        try {
            await getRepository(Unit).insert(newUnit);
        } catch (error) {
            this.debugLog(error.message);
            return res.status(400).render("unit/addUnit", {
                message: "Unit with that name already exists.",
                messageClass: "alert-danger"
            });
        }

        return res.redirect("/unit");
    }
}