import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Unit } from "./Unit";

export enum WargearType {
    Melee = "melee",
    Ranged = "ranged",
    Other = "other"
}

@Entity()
export class Wargear {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true, length: 64 })
    name!: string;

    @Column({ type: "enum", enum: WargearType, default: WargearType.Other })
    type!: WargearType;

    @Column()
    pointValue!: number;

    @ManyToMany(() => Unit, unit => unit.wargear)
    units!: number;
}