// audio-file.entity.ts
import { CoreEntity } from '../../common/entities/core.entity';
import { Column, Entity, JoinColumn, ManyToOne, RelationId } from 'typeorm';
import { Podcast } from '../../podcast/entities/podcast.entity';

@Entity({ name: 'audio_files' })
export class AudioFile extends CoreEntity {
  @Column({ type: 'text' })
  file_path: string;

  @ManyToOne(() => Podcast, (podcast) => podcast.audioFiles, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'podcast_id' })
  podcast: Podcast;

  @Column({})
  @RelationId((audioFile: AudioFile) => audioFile.podcast)
  podcast_id: number;
}
