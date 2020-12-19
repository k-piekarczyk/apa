import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum PaintType {
    Base = 'base',
    Layer = 'layer',
    Shade = 'shade',
    Technical = 'technical'
}

@Entity()
export class Paint {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({type: 'enum', enum: PaintType, default: PaintType.Base})
    type!: PaintType;

    // TODO: add relation with PaintScheme
}