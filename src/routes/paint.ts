import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Paint } from "../entity/Paint";
import { PaintScheme } from "../entity/PaintScheme";
import { PaintSchemePart } from "../entity/PaintSchemePart";
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
            .get("/add", this.addView.bind(this))
            .post("/add", this.add.bind(this))
            .get("/collection", this.getCollection.bind(this))
            .get("/:paintID/collection/add", this.addToCollection.bind(this))
            .get("/:paintID/collection/remove", this.removeFromCollection.bind(this))
            .get("/scheme", this.getAllSchemes.bind(this))
            .get("/scheme/add", this.addSchemeView.bind(this))
            .post("/scheme/add", this.addScheme.bind(this))
            .get("/scheme/:schemeID", this.getScheme.bind(this))
            .get("/:paintID/scheme/:schemeID/add", this.addPaintToScheme.bind(this))
    }

    async getAll(req: IRequest, res: Response) {
        const paints = await getRepository(Paint).find({ relations: ["owners"] });
        const mapped = paints.map(paint => {
            const p: any = Object.assign({}, paint)
            p["owned"] = paint.owners.find(u => u.username === req.token.user.username);
            return p;
        })
        return res.render("paint/paints", {
            paints: mapped
        });
    }

    async addView(req: IRequest, res: Response) {
        return res.render("paint/addPaint");
    }

    async add(req: IRequest, res: Response) {
        const { name, type } = req.body;

        let newPaint = new Paint();
        newPaint.name = name;
        newPaint.type = type;

        try {
            await getRepository(Paint).insert(newPaint);
        } catch (err) {
            return res.status(400).render("paint/addPaint", {
                message: "A paint with that name already exists.",
                messageClass: "alert-danger"
            });
        }

        return res.status(201).redirect("/paint");
    }

    async getCollection(req: IRequest, res: Response) {
        let user = await getRepository(User).findOne({ username: req.token?.user.username }, { relations: ["paints"] });
        return res.render("paint/collection", {
            paints: user.paints
        });
    }

    async addToCollection(req: IRequest, res: Response) {
        try {
            let paint = await getRepository(Paint).findOneOrFail({ id: Number.parseInt(req.params.paintID) }, { relations: ["owners"] });

            paint.owners.push(req.token.user);

            await getRepository(Paint).save(paint);

            return res.status(201).redirect("/paint");
        } catch (err) {
            return res.status(201).redirect("/paint");
        }
    }

    async removeFromCollection(req: IRequest, res: Response) {
        try {
            let paint = await getRepository(Paint).findOneOrFail({ id: Number.parseInt(req.params.paintID) }, { relations: ["owners"] });

            paint.owners = paint.owners.filter(u => u.username !== req.token.user.username);

            await getRepository(Paint).save(paint);

            return res.status(201).redirect("/paint/collection");
        } catch (err) {
            return res.status(201).redirect("/paint/collection");
        }
    }

    async getAllSchemes(req: IRequest, res: Response) {
        const schemes = await getRepository(PaintScheme).find();
        return res.render("scheme/schemeList", { schemes });
    }

    async addSchemeView(req: IRequest, res: Response) {
        return res.render("scheme/addScheme");
    }

    async addScheme(req: IRequest, res: Response) {
        let newScheme = new PaintScheme();
        newScheme.name = req.body.name;

        try {
            await getRepository(PaintScheme).insert(newScheme);
            const scheme = await getRepository(PaintScheme).findOne({name: newScheme.name});
            return res.status(201).redirect("/paint/scheme/" + scheme.id);
        } catch (err) {
            return res.status(400).render("scheme/addScheme", {
                message: "There is a scheme with that name already.",
                messageClass: "alert-default"
            });
        }
    }

    async getScheme(req: IRequest, res: Response) {
        const schemeID = Number.parseInt(req.params.schemeID);

        try {
            const scheme = await getRepository(PaintScheme).findOne({id: schemeID});
            const schemeParts = await getRepository(PaintSchemePart).find({scheme: scheme});
            const paints = await getRepository(Paint).find();

            return res.render("scheme/schemeDetail", {
                scheme,
                schemeParts,
                paints
            });
        } catch (err) {
            return res.send({
                message: err.message
            });
        }
    }

    async addPaintToScheme(req: IRequest, res: Response) {
        const paintID = Number.parseInt(req.params.paintID);
        const schemeID = Number.parseInt(req.params.schemeID); 

        const scheme = await getRepository(PaintScheme).findOne({id: schemeID});
        const paint = await getRepository(Paint).findOne({id: paintID}); 
        const order = await getRepository(PaintSchemePart).count({scheme}) + 1;

        let part = new PaintSchemePart();
        part.order = order;
        part.scheme = scheme;
        part.paint = paint;

        await getRepository(PaintSchemePart).insert(part);

        res.redirect(`/paint/scheme/${schemeID}`);
    }
}