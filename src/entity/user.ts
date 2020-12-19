import {Entity, PrimaryColumn, Column} from 'typeorm';

@Entity()
export class User {
    
    @PrimaryColumn({length: 32})
    username!: string;

    @Column({length: 254, unique: true})
    email!: string

    @Column({length: 60})
    passwordHash!: string
}