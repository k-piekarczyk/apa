import { Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Unit {

    @PrimaryColumn({length: 64})
    name!: string;
    
    
}