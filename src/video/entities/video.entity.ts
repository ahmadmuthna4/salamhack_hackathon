// video.entity.ts
import { CoreEntity } from "../../common/entities/core.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, RelationId } from "typeorm";
import { User } from "../../user/entities/user.entity";
import { Transcript } from "../../transcript/entities/transcript.entity";

@Entity()
export class Video extends CoreEntity {
  @Column({ type: 'varchar' })
  youtube_url: string;

  @Column({ type: 'varchar', nullable: true })
  title: string;

  @Column({ type: 'varchar', nullable: true })
  image_path: string;

  @Column({ type: 'boolean', default: false })
  processed: boolean;

  @ManyToOne(() => User, user => user.videos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  @RelationId((video: Video) => video.user)
  user_id: number;

  @OneToMany(() => Transcript, transcript => transcript.video)
  transcripts: Transcript[];
}