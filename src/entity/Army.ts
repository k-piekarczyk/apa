import { Entity, PrimaryColumn, Column, ManyToOne, OneToMany, PrimaryGeneratedColumn, JoinTable } from "typeorm";
import { Force } from "./Force";
import { UnitVariant } from "./UnitVariant";
import { User } from "./User";

@Entity()
export class Army {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 256, unique: true})
    name!: string;

    @ManyToOne(() => User, user => user.armies, { cascade: true })
    user!: User;

    @ManyToOne(() => Force, force => force.armies, { cascade: true, eager: true })
    force!: Force;

    @OneToMany(() => UnitVariant, unitVariant => unitVariant.army, { cascade: true })
    @JoinTable()
    unitVariants!: UnitVariant[];

    @Column()
    pointValue!: number;
}