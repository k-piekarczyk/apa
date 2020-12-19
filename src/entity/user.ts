import {Entity, PrimaryColumn, Column, ManyToMany, JoinTable} from 'typeorm';
import { Paint } from './Paint';

@Entity()
export class User {
    
    @PrimaryColumn({length: 32})
    username!: string;

    @Column({length: 254, unique: true})
    email!: string;

    @Column({length: 60})
    passwordHash!: string;

    @ManyToMany(type => Paint, paint => paint.owners)
    @JoinTable()
    paints!: Paint[];
}