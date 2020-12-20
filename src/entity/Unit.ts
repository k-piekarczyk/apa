import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Force } from "./Force";

@Entity()
export class Unit {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({unique: true, length: 64})
    name!: string;
    
    @ManyToOne(() => Force, force => force.units)
    force!: Force;

    @Column("int4range")
    modelsPerUnit!: string;

    @Column()
    pointsPerModel!: number;

    // TODO: ogarnąć jaki ma być type
}