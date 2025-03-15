import { CoreEntity } from "../../common/entities/core.entity";
import { Column, Entity, Index, OneToMany, OneToOne } from "typeorm";
import { Video } from "../../video/entities/video.entity";
import { UserRoleEnum } from "../dto/create-user.dto";
import { Exclude } from "class-transformer";

import { UserProgress } from "../../user-progress/entities/user-progress.entity";

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

  @OneToMany(() => Video, video => video.user)
  videos: Video[];



  @OneToOne(() => UserProgress, userProgress => userProgress.user)
  progress: UserProgress;


}
