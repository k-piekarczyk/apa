import { Column, Entity, PrimaryGeneratedColumn, ManyToMany} from "typeorm";
import { User } from "./User";

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

    @ManyToMany(type => User, user => user.paints)
    owners!: Paint[];

    // TODO: add relation with PaintScheme
}