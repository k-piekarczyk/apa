import { type } from 'os';
import {Entity, OneToMany, PrimaryColumn} from 'typeorm';
import { Army } from './Army';
import { Unit } from './Unit';

@Entity()
export class Force {
    
    @PrimaryColumn({length: 32})
    name!: string;

    @OneToMany(type => Army, army => army.force)
    armies!: Army[];

    @OneToMany(type => Unit, unit => unit.force)
    units!: Unit[];
}