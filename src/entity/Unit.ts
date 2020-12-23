import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, ManyToMany, JoinTable } from "typeorm";
import { Force } from "./Force";
import { PaintScheme } from "./PaintScheme";
import { Wargear } from "./Wargear";

@Entity()
export class Unit {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true, length: 64 })
    name!: string;

    @ManyToOne(() => Force, force => force.units, {cascade: true, eager: true})
    force!: Force;

    @Column()
    minModelsPerUnit!: number;

    @Column()
    maxModelsPerUnit!: number;

    @Column()
    pointsPerModel!: number;

    @Column({ length: 32 })
    type!: string;

    @ManyToMany(() => PaintScheme, paintScheme => paintScheme.units, {cascade: true})
    @JoinTable()
    paintSchemes!: PaintScheme[];

    @ManyToMany(() => Wargear, wargear => wargear.units, {cascade: true})
    @JoinTable()
    wargear!: Wargear[];
}