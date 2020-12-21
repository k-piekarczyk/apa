import { Response } from "express";
import { getRepository } from "typeorm";
import { Paint } from "../entity/Paint";
import { PaintScheme } from "../entity/PaintScheme";
import { User } from "../entity/User";
import { IRequest } from "../interfaces/request";
import { verifiedUser } from "../middleware/auth";
import { CommonRouter } from "./common";

export class PaintRouter extends CommonRouter {
    constructor(baseURL: string) {
        super("PaintRouter", baseURL);
    }

    configureRoutes() {
        this.router
            .use(verifiedUser)
            .get("/", this.getAll.bind(this))
            .post("/", this.add.bind(this))
            .get("/collection", this.getCollection.bind(this))
            .post("/collection", this.addToCollection.bind(this))
            .get("/scheme", this.getAllSchemes.bind(this))
            .post("/scheme", this.addScheme.bind(this))
            .get("/:paintID", this.get.bind(this))
    }

    async get(req: IRequest, res: Response) {
        try {
            const paint = await getRepository(Paint).findOneOrFail({ id: Number.parseInt(req.params.paintID) });
            return res.status(200).json(paint);
        } catch (err) {
            return res.status(400).json({
                message: err.message
            });
        }
    }

    async getAll(req: IRequest, res: Response) {
        const paints = await getRepository(Paint).find();
        return res.status(200).json(paints);
    }

    async add(req: IRequest, res: Response) {
        let newPaint = new Paint();
        newPaint.name = req.body.name;
        newPaint.type = req.body.type;

        try {
            await getRepository(Paint).insert(newPaint);
            return res.status(201).json(newPaint);
        } catch (err) {
            return res.status(400).json({
                message: err.message
            });
        }
    }

    async getCollection(req: IRequest, res: Response) {
        let user = await getRepository(User).findOne({username: req.token?.user.username}, {relations: ["paints"]});
        return res.json(user.paints)
    }

    async addToCollection(req: IRequest, res: Response) {
        try {
            let paint = await getRepository(Paint).findOneOrFail({ id: req.body.paintID }, {relations: ["owners"]});
            
            paint.owners.push(req.token.user);

            await getRepository(Paint).save(paint);

            return res.status(201).json({
                message: "Added to collection."
            });
        } catch (err) {
            return res.status(400).json({
                message: err.message
            });
        }
    }

    async getAllSchemes(req: IRequest, res: Response) {
        const schemes = await getRepository(PaintScheme).find();
        return res.status(200).json(schemes);
    }

    async addScheme(req: IRequest, res: Response) {
        let newScheme = new PaintScheme();
        newScheme.name = req.body.name;

        try {
            await getRepository(PaintScheme).insert(newScheme);
            return res.status(201).json(newScheme);
        } catch (err) {
            return res.status(400).json({
                message: err.message
            });
        }
    }
}