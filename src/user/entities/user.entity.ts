import { CoreEntity } from "../../common/entities/core.entity";
import { Column, Entity, Index } from "typeorm";
import { UserRoleEnum } from "../dto/create-user.dto";
import { Exclude } from "class-transformer";

@Entity()
export class User extends CoreEntity {


  @Column({ type: 'varchar', unique: true, nullable: true })
  email: string;

  @Column({ type: 'varchar', nullable: true })
  @Index()
  name: string;

  @Column({ type: 'varchar' })
  @Exclude()
  password: string;

  @Column({ type: 'varchar', nullable: true })
  language_preference: string;


  @Column({ type: 'enum', enum: UserRoleEnum, default: UserRoleEnum.USER })
  role: UserRoleEnum;




}
