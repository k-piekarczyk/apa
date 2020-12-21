import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Army } from "./Army";
import { Unit } from "./Unit";
import { WargearVariant } from "./WargearVariant";

@Entity()
export class UnitVariant {

    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Army, army => army.units)
    army!: Army;

    @ManyToOne(() => Unit)
    @JoinColumn([{ name: "unit_id", referencedColumnName: "id" }])
    unit!: Unit;

    @Column()
    numberOfModels!: number;

    @Column()
    pointValue!: number;

    @OneToMany(() => WargearVariant, wargearVariant => wargearVariant.unit, {cascade: true})
    wargearVariant!: WargearVariant;
}