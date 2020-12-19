import {Entity, PrimaryColumn} from 'typeorm';

@Entity()
export class Force {
    
    @PrimaryColumn({length: 32})
    name!: string;
}