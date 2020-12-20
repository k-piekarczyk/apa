import { Entity, PrimaryColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Force } from './Force';
import { UnitVariant } from './UnitVariant';
import { User } from './User';

@Entity()
export class Army {

    @PrimaryColumn({ length: 256 })
    name!: string;

    @ManyToOne(() => User, user => user.armies)
    user!: User;

    @Column({ length: 254, unique: true })
    email!: string

    @Column({ length: 60 })
    passwordHash!: string

    @ManyToOne(() => Force, force => force.armies)
    force!: Force;

    @OneToMany(() => UnitVariant, unitVariant => unitVariant.army)
    units!: UnitVariant[];
}