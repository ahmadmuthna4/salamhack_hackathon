
// transcript.entity.ts
import { CoreEntity } from "../../common/entities/core.entity";
import { Column, Entity, JoinColumn, ManyToOne, RelationId } from "typeorm";
import { Video } from "../../video/entities/video.entity";

@Entity()
export class Transcript extends CoreEntity {
  @Column({ type: 'text' })
  text: string;

  @Column({ type: 'float', nullable: true })
  timestamp_start: number;

  @Column({ type: 'float', nullable: true })
  timestamp_end: number;

  @ManyToOne(() => Video, video => video.transcripts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'video_id' })
  video: Video;

  @Column()
  @RelationId((transcript: Transcript) => transcript.video)
  video_id: number;
}