// podcast.entity.ts
import { CoreEntity } from '../../common/entities/core.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  RelationId,
} from 'typeorm';
import { Video } from '../../video/entities/video.entity';
import { Transcript } from '../../transcript/entities/transcript.entity';
import { AudioFile } from '../../audio-file/entities/audio-file.entity';

import { Exercise } from '../../exercise/entities/exercise.entity';

@Entity()
export class Podcast extends CoreEntity {
  @ManyToOne(() => Video, (video) => video.podcasts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'video_id' })
  video: Video;

  @Column()
  @RelationId((podcast: Podcast) => podcast.video)
  video_id: number;

  @ManyToOne(() => Transcript, (transcript) => transcript.podcasts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'transcript_id' })
  transcript: Transcript;

  @Column()
  @RelationId((podcast: Podcast) => podcast.transcript)
  transcript_id: number;

  @Column({ type: 'text', name: 'ai_generated_text' })
  ai_generated_text: string;

  @OneToMany(() => AudioFile, (audioFile) => audioFile.podcast)
  audioFiles: AudioFile[];

  @OneToMany(() => Exercise, (exercise) => exercise.podcast)
  exercises: Exercise[];
}
