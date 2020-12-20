import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PaintSchemePart } from "./PaintSchemePart";

@Entity()
export class PaintScheme {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true, length: 64 })
    name!: string;

    @Column()
    image!:({})

    @OneToMany(() => PaintSchemePart, paintSchemePart => paintSchemePart.scheme)
    paintSchemeParts!: PaintSchemePart[];
}