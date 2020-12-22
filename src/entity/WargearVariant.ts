import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UnitVariant } from "./UnitVariant";
import { Wargear } from "./Wargear";

@Entity()
export class WargearVariant {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    count!: number;

    @ManyToOne(() => Wargear, { eager: true })
    @JoinColumn([{ name: "wargear_id", referencedColumnName: "id" }])
    wargear!: Wargear;

    @ManyToOne(() => UnitVariant, unitVariant => unitVariant.wargearVariants)
    unit!: UnitVariant;
}