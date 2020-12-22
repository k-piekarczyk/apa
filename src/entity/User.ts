import { Entity, PrimaryColumn, Column, ManyToMany, JoinTable, OneToMany } from "typeorm";
import { Army } from "./Army";
import { Paint } from "./Paint";

@Entity()
export class User {

    @PrimaryColumn({ length: 32 })
    username!: string;

    @Column({ length: 60 })
    passwordHash!: string;

    @ManyToMany(() => Paint, paint => paint.owners)
    @JoinTable()
    paints!: Paint[];

    @OneToMany(() => Army, army => army.user)
    armies!: Army[];
}