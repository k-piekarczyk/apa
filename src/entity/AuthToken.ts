import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class AuthToken {
    
    @PrimaryColumn({length: 60})
    token!: string;

    @ManyToOne(() => User)
    @JoinColumn([{ name: "user_username", referencedColumnName: "username" }])
    user!: User;

    @Column()
    revoked!: boolean;
}