import { Column, Entity, PrimaryGeneratedColumn, ManyToMany, OneToMany } from "typeorm";
import { PaintSchemePart } from "./PaintSchemePart";
import { User } from './User';

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

    @Column({ type: 'enum', enum: PaintType, default: PaintType.Base })
    type!: PaintType;

    @ManyToMany(() => User, user => user.paints)
    owners!: Paint[];

    @OneToMany(() => PaintSchemePart, paintSchemePart => paintSchemePart.paint)
    paintSchemeParts!: PaintSchemePart[];
}