import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PaintSchemePart } from "./PaintSchemePart";
import { Unit } from "./Unit";

@Entity()
export class PaintScheme {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true, length: 64 })
    name!: string;

    @Column()
    image!: string;

    @ManyToMany(() => Unit, unit => unit.paintSchemes)
    units!: Unit[];

    @OneToMany(() => PaintSchemePart, paintSchemePart => paintSchemePart.scheme)
    paintSchemeParts!: PaintSchemePart[];
}