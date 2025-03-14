import { CoreEntity } from "../../common/entities/core.entity";
import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserRoleEnum } from "../dto/create-user.dto";
import { Exclude } from "class-transformer";
import { Prediction } from "../../prediction/entities/prediction.entity";

@Entity()
export class User extends CoreEntity {

    
    @Column({ type: 'varchar', unique: true,nullable:true })
    email: string;

    @Column({ type: 'varchar',nullable:true })
    @Index()
    name: string;

    @Column({ type: 'varchar' })
    @Exclude()
    password: string;

    @Column({ type: 'enum', enum: UserRoleEnum, default: UserRoleEnum.USER })
    role: UserRoleEnum;
    

    @OneToMany(() => Prediction, prediction => prediction.team)
  prediction: Prediction[];
   
}
