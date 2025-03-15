// user-progress.entity.ts
import { CoreEntity } from "../../common/entities/core.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, RelationId } from "typeorm";
import { User } from "../../user/entities/user.entity";

@Entity({ name: 'user_progress' })
export class UserProgress extends CoreEntity {


  @RelationId((userProgress: UserProgress) => userProgress.user)
  user_id: number;

  @ManyToOne(() => User, user => user.progress, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ default: 0 })
  xp_points: number;

  @Column({ default: 1 })
  level: number;
}
