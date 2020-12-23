import { Response } from "express";
import { getRepository } from "typeorm";
import { Force } from "../entity/Force";
import { Army } from "../entity/Army";
import { IRequest } from "../interfaces/request";
import { verifiedUser } from "../middleware/auth";
import { CommonRouter } from "./common";
import { Unit } from "../entity/Unit";
import { UnitVariant } from "../entity/UnitVariant";
import { User } from "../entity/User";
import { Wargear } from "../entity/Wargear";
import { WargearVariant } from "../entity/WargearVariant";

export class ArmyRouter extends CommonRouter {
    constructor(baseURL: string) {
        super("ArmyRouter", baseURL);
    }

    configureRoutes() {
        this.router
            .use(verifiedUser)
            .get("/", this.armyList.bind(this))
            .get("/add", this.addArmyView.bind(this))
            .post("/add", this.addArmy.bind(this))
            .get("/:armyID", this.armyDetail.bind(this))
            .get("/:armyID/paints", this.armyPaints.bind(this))
            .get("/:armyID/unit/:unitID/add", this.addUnitToArmy.bind(this))
            .get("/:armyID/unitVariant/:unitVariantID", this.getUnitVariant.bind(this))
            .get("/:armyID/unitVariant/:unitVariantID/decrease", this.decreaseUnitCount.bind(this))
            .get("/:armyID/unitVariant/:unitVariantID/increase", this.increaseUnitCount.bind(this))
            .get("/:armyID/unitVariant/:unitVariantID/wargear/:wargearID/add", this.addWargearToUnitVariant.bind(this))
            .get("/:armyID/unitVariant/:unitVariantID/wargearVariant/:wargearVariantID/decrease", this.decreaseWargearCount.bind(this))
            .get("/:armyID/unitVariant/:unitVariantID/wargearVariant/:wargearVariantID/increase", this.increaseWargearCount.bind(this))
    }

    async armyList(req: IRequest, res: Response) {
        const user = await getRepository(User).findOne({ username: req.token.user.username })
        const armies = await getRepository(Army).find({ user: user });
        return res.render("army/listArmy", { armies });
    }

    async addArmyView(req: IRequest, res: Response) {
        const forces = await getRepository(Force).find()
        return res.render("army/addArmy", { forces });
    }

    async addArmy(req: IRequest, res: Response) {
        const { name, forceName } = req.body;
        const user = await getRepository(User).findOne({ username: req.token.user.username })

        let newArmy = new Army();
        newArmy.name = name;
        newArmy.user = user;
        newArmy.force = await getRepository(Force).findOne({ name: forceName });
        newArmy.pointValue = 0;

        try {
            await getRepository(Army).insert(newArmy);
        } catch (error) {
            this.debugLog(error.message);
            return res.status(400).render("army/addArmy", {
                message: "Army with that name already exists.",
                messageClass: "alert-danger"
            });
        }

        return res.redirect("/army");
    }

    async armyDetail(req: IRequest, res: Response) {
        const armyID = Number.parseInt(req.params.armyID);

        const army = await getRepository(Army).findOne({ id: armyID });
        const unitVariants = await getRepository(UnitVariant).find({ where: { army: army }, relations: ["unit", "wargearVariants", "wargearVariants.wargear"] });
        const units = await getRepository(Unit).find({ force: army.force });
        return res.render("army/armyDetail", {
            army,
            unitVariants,
            units
        })
    }

    async addUnitToArmy(req: IRequest, res: Response) {
        const armyID = Number.parseInt(req.params.armyID);
        const unitID = Number.parseInt(req.params.unitID);

        const army = await getRepository(Army).findOne({ id: armyID }, { relations: ["unitVariants"] });

        const unit = await getRepository(Unit).findOne({ id: unitID });

        let unitVariant = new UnitVariant();
        unitVariant.army = army;
        unitVariant.unit = unit;
        unitVariant.numberOfModels = unit.minModelsPerUnit;
        unitVariant.pointValue = unit.minModelsPerUnit * unit.pointsPerModel;

        army.pointValue += unitVariant.pointValue;

        const uvRepo = getRepository(UnitVariant);
        await uvRepo.insert(unitVariant);
        army.unitVariants.push(unitVariant);

        await getRepository(Army).save(army);

        return res.redirect("/army/" + armyID);
    }

    async getUnitVariant(req: IRequest, res: Response) {
        const unitVariantID = Number.parseInt(req.params.unitVariantID);
        const unitVariant = await getRepository(UnitVariant).findOne({ id: unitVariantID }, { relations: ["unit", "army", "wargearVariants", "wargearVariants.wargear"] });
        const wargear = await getRepository(Wargear).find();

        this.debugLog(unitVariant.wargearVariants);

        return res.render("army/unitVariantDetail", {
            unitVariant,
            wargear
        })
    }

    async addWargearToUnitVariant(req: IRequest, res: Response) {
        const unitVariantID = Number.parseInt(req.params.unitVariantID);
        const wargearID = Number.parseInt(req.params.wargearID);
        const unitVariant = await getRepository(UnitVariant).findOne({ id: unitVariantID }, { relations: ["unit", "army", "wargearVariants"] });
        const wargear = await getRepository(Wargear).findOne({ id: wargearID });
        const army = unitVariant.army;

        let wv = new WargearVariant();
        wv.unit = unitVariant;
        wv.count = 1;
        wv.wargear = wargear;

        await getRepository(WargearVariant).insert(wv);

        unitVariant.wargearVariants.push(wv);
        unitVariant.pointValue += wargear.pointValue;
        army.pointValue += wargear.pointValue;

        await getRepository(UnitVariant).save(unitVariant);
        await getRepository(Army).save(army);

        return res.redirect("/army/" + army.id + "/unitVariant/" + unitVariant.id);
    }

    async decreaseWargearCount(req: IRequest, res: Response) {
        const unitVariantID = Number.parseInt(req.params.unitVariantID);
        const wargearVariantID = Number.parseInt(req.params.wargearVariantID);
        const uv = await getRepository(UnitVariant).findOne({ id: unitVariantID }, { relations: ["unit", "army"] });
        const wv = await getRepository(WargearVariant).findOne({ id: wargearVariantID }, { relations: ["wargear"] });
        const army = uv.army;

        if (wv.count > 1) {
            wv.count -= 1;
            uv.pointValue -= wv.wargear.pointValue;
            army.pointValue -= wv.wargear.pointValue;

            await getRepository(UnitVariant).save(uv);
            await getRepository(Army).save(army);
            await getRepository(WargearVariant).save(wv);
        }

        return res.redirect("/army/" + army.id + "/unitVariant/" + uv.id);
    }

    async increaseWargearCount(req: IRequest, res: Response) {
        const unitVariantID = Number.parseInt(req.params.unitVariantID);
        const wargearVariantID = Number.parseInt(req.params.wargearVariantID);
        const uv = await getRepository(UnitVariant).findOne({ id: unitVariantID }, { relations: ["unit", "army"] });
        const wv = await getRepository(WargearVariant).findOne({ id: wargearVariantID }, { relations: ["wargear"] });
        const army = uv.army;


        wv.count += 1;
        uv.pointValue += wv.wargear.pointValue;
        army.pointValue += wv.wargear.pointValue;

        await getRepository(UnitVariant).save(uv);
        await getRepository(Army).save(army);
        await getRepository(WargearVariant).save(wv);


        return res.redirect("/army/" + army.id + "/unitVariant/" + uv.id);
    }

    async decreaseUnitCount(req: IRequest, res: Response) {
        const unitVariantID = Number.parseInt(req.params.unitVariantID);
        const uv = await getRepository(UnitVariant).findOne({ id: unitVariantID }, { relations: ["unit", "army"] });
        const army = uv.army;

        if (uv.numberOfModels > uv.unit.minModelsPerUnit) {
            uv.numberOfModels -= 1;
            uv.pointValue -= uv.unit.pointsPerModel;
            army.pointValue -= uv.unit.pointsPerModel;

            await getRepository(UnitVariant).save(uv);
            await getRepository(Army).save(army);
        }

        return res.redirect("/army/" + army.id);
    }

    async increaseUnitCount(req: IRequest, res: Response) {
        const unitVariantID = Number.parseInt(req.params.unitVariantID);
        const uv = await getRepository(UnitVariant).findOne({ id: unitVariantID }, { relations: ["unit", "army"] });
        const army = uv.army;

        if (uv.numberOfModels < uv.unit.maxModelsPerUnit) {
            uv.numberOfModels += 1;
            uv.pointValue += uv.unit.pointsPerModel;
            army.pointValue += uv.unit.pointsPerModel;

            await getRepository(UnitVariant).save(uv);
            await getRepository(Army).save(army);
        }

        return res.redirect("/army/" + army.id);
    }

    async armyPaints(req: IRequest, res: Response) {
        const armyID = Number.parseInt(req.params.armyID);
        const army = await getRepository(Army).findOne({ id: armyID }, { relations: [
            "unitVariants", 
            "unitVariants.unit", 
            "unitVariants.unit.paintSchemes", 
            "unitVariants.unit.paintSchemes.paintSchemeParts"
        ]});

        const units = army.unitVariants.map(el => el.unit);
        const schemes = units.map(el => el.paintSchemes);
        const flatSchemes = [].concat(...schemes);
        const parts = flatSchemes.map(el => el.paintSchemeParts);
        const flatParts = [].concat(...parts);
        const paints = flatParts.map(el => el.paint)
        
        let ids: number[] = [];
        const paintSet = paints.filter(el => {
            if (!ids.find(i => i == el.id)) {
                ids.push(el.id);
                return true;
            } else return false;
        })

        return res.render("army/armyPaintList", {army, paintSet});
    }
}