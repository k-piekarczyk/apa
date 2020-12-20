import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Army } from "./Army";
import { Unit } from "./Unit";

@Entity()
export class UnitVariant {

    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Army, army => army.units)
    army!: Army;

    @ManyToOne(() => Unit)
    @JoinColumn([{name: "unit_id", referencedColumnName: "id"}])
    unit!: Unit;
}