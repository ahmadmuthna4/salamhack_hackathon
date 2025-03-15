// transcript.entity.ts
import { CoreEntity } from '../../common/entities/core.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  RelationId,
  OneToMany,
} from 'typeorm';
import { Video } from '../../video/entities/video.entity';
import { Keyword } from '../../keyword/entities/keyword.entity';
import { Podcast } from 'src/podcast/entities/podcast.entity';

@Entity()
export class Transcript extends CoreEntity {
  @Column({ type: 'text' })
  text: string;

  @Column({ type: 'float', nullable: true })
  timestamp_start: number;

  @Column({ type: 'float', nullable: true })
  timestamp_end: number;

  @Column({ type: 'float', nullable: true })
  duration: number;

  @Column({ type: 'int', nullable: true })
  sequence: number;

  @ManyToOne(() => Video, (video) => video.transcripts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'video_id' })
  video: Video;

  @Column()
  @RelationId((transcript: Transcript) => transcript.video)
  video_id: number;

  // @OneToMany(() => Keyword, (keyword) => keyword.transcript)
  // keywords: Keyword[];

  // @OneToMany(() => Podcast, (podcast) => podcast.transcript)
  // podcasts: Podcast[];
}
