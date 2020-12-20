import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class PaintScheme {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true, length: 64 })
    name!: string;
}