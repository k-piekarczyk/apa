import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Unit } from "./Unit";

@Entity()
export class Wargear {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true, length: 64 })
    name!: string;

    @Column({ length: 32 })
    type!: string;

    @Column()
    pointValue!: number;

    @ManyToMany(() => Unit, unit => unit.wargear)
    units!: number;
}