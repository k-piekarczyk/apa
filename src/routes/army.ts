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
            .get("/:armyID/unit/:unitID/add", this.addUnitToArmy.bind(this))
            .get("/:armyID/unitVariant/:unitVariantID", this.getUnitVariant.bind(this))
            .get("/:armyID", this.armyDetail.bind(this))
    }

    async armyList(req: IRequest, res: Response) {
        const user = await getRepository(User).findOne({username: req.token.user.username})
        const armies = await getRepository(Army).find({user: user});
        return res.render("army/listArmy", { armies });
    }

    async addArmyView(req: IRequest, res: Response) {
        const forces = await getRepository(Force).find()
        return res.render("army/addArmy", { forces });
    }

    async addArmy(req: IRequest, res: Response) {
        const { name, forceName} = req.body;
        const user = await getRepository(User).findOne({username: req.token.user.username})

        let newArmy = new Army();
        newArmy.name = name;
        newArmy.user =  user;
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

        const army = await getRepository(Army).findOne({id: armyID});
        const unitVariants = await getRepository(UnitVariant).find({where: {army: army}, relations: ["unit", "wargearVariants", "wargearVariants.wargear"]});
        const units = await getRepository(Unit).find({force: army.force});
        this.debugLog(unitVariants)
        return res.render("army/armyDetail", {
            army,
            unitVariants,
            units
        })
    }

    async addUnitToArmy(req: IRequest, res: Response) {
        const armyID = Number.parseInt(req.params.armyID);
        const unitID = Number.parseInt(req.params.unitID);
        
        const army = await getRepository(Army).findOne({id: armyID}, {relations: ["unitVariants"]});
        
        const unit = await getRepository(Unit).findOne({id: unitID});

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
        const unitVariant = await getRepository(UnitVariant).findOne({id: unitVariantID}, {relations: ["unit", "wargearVariants", "wargearVariants.wargear"]});
        const wargear = await getRepository(Wargear).find();

        return res.render("army/unitVariantDetail", {
            unitVariant,
            wargear
        })
    }
}