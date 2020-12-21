import { Column, Entity, PrimaryGeneratedColumn, ManyToMany, OneToMany } from "typeorm";
import { PaintSchemePart } from "./PaintSchemePart";
import { User } from "./User";

@Entity()
export class Paint {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({unique: true, length: 64})
    name!: string;

    @Column({length: 32})
    type!: string;

    @ManyToMany(() => User, user => user.paints, {cascade: true})
    owners!: Paint[];

    @OneToMany(() => PaintSchemePart, paintSchemePart => paintSchemePart.paint, {cascade: true})
    paintSchemeParts!: PaintSchemePart[];
}