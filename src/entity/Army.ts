import { Entity, PrimaryColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { Force } from "./Force";
import { UnitVariant } from "./UnitVariant";
import { User } from "./User";

@Entity()
export class Army {

    @PrimaryColumn({ length: 256 })
    name!: string;

    @ManyToOne(() => User, user => user.armies, {cascade: true})
    user!: User;

    @ManyToOne(() => Force, force => force.armies, {cascade: true})
    force!: Force;

    @OneToMany(() => UnitVariant, unitVariant => unitVariant.army, {cascade: true})
    units!: UnitVariant[];

    @Column()
    pointValue!: number;
}