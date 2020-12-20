import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, ManyToMany, JoinTable } from "typeorm";
import { Force } from "./Force";
import { PaintScheme } from "./PaintScheme";
import { Wargear } from "./Wargear";

export enum UnitType {
    HQ = "hq",
    Troops = "troops",
    Rlites = "elites",
    FastAttack = "fast_attack",
    HeavySupport = "heavy_support",
    DedicatedTransport = "dedicated_transport",
    Flyer = "flyer",
    Fortification = "fortification"
}

@Entity()
export class Unit {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true, length: 64 })
    name!: string;

    @ManyToOne(() => Force, force => force.units)
    force!: Force;

    @Column("int4range")
    modelsPerUnit!: string;

    @Column()
    pointsPerModel!: number;

    @Column({ type: "enum", enum: UnitType, default: UnitType.Troops })
    type!: UnitType;

    @ManyToMany(() => PaintScheme, paintScheme => paintScheme.units)
    @JoinTable()
    paintSchemes!: PaintScheme[];

    @ManyToMany(() => Wargear, wargear => wargear.units)
    @JoinTable()
    wargear!: Wargear[];
}