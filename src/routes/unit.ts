import { Response } from "express";
import { getRepository } from "typeorm";
import { RelationLoader } from "typeorm/query-builder/RelationLoader";
import { Force } from "../entity/Force";
import { PaintScheme } from "../entity/PaintScheme";
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
            .get("/:unitID", this.unitDetail.bind(this))
            .get("/:unitID/scheme/:schemeID/add", this.addSchemeToUnit.bind(this))
    }

    async unitList(req: IRequest, res: Response) {
        const units = await getRepository(Unit).find();
        return res.render("unit/listUnit", { units });
    }

    async addUnitView(req: IRequest, res: Response) {
        const forces = await getRepository(Force).find()
        return res.render("unit/addUnit", { forces });
    }

    async addUnit(req: IRequest, res: Response) {
        const { name, forceName, type, minPerUnit, maxPerUnit, pointsPerModel } = req.body;

        let newUnit = new Unit();
        newUnit.name = name;
        newUnit.force = await getRepository(Force).findOne({ name: forceName });
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

    async unitDetail(req: IRequest, res: Response) {
        const unitID = Number.parseInt(req.params.unitID);

        const unit = await getRepository(Unit).findOne({id: unitID}, {relations: ["paintSchemes"]});
        const schemes = await getRepository(PaintScheme).find();

        return res.render("unit/unitDetail", {
            unit,
            schemes
        })
    }

    async addSchemeToUnit(req: IRequest, res: Response) {
        const unitID = Number.parseInt(req.params.unitID);
        const schemeID = Number.parseInt(req.params.schemeID);

        const unit = await getRepository(Unit).findOne({id: unitID}, {relations: ["paintSchemes"]});
        const scheme = await getRepository(PaintScheme).findOne({id: schemeID});

        unit.paintSchemes.push(scheme);

        await getRepository(Unit).save(unit);

        return res.redirect("/unit/" + unitID);
    }
}