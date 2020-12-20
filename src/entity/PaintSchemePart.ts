import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Paint } from "./Paint";
import { PaintScheme } from "./PaintScheme";

@Entity()
export class PaintSchemePart {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    order!: number;

    @ManyToOne(() => Paint, paint => paint.paintSchemeParts)
    paint!: Paint;

    @ManyToOne(() => PaintScheme, paintScheme => paintScheme.paintSchemeParts)
    scheme!: PaintScheme;
}