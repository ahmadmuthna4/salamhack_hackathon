// keyword.entity.ts
import { CoreEntity } from '../../common/entities/core.entity';
import { Column, Entity, JoinColumn, ManyToOne, RelationId } from 'typeorm';
import { Transcript } from '../../transcript/entities/transcript.entity';
import { Video } from 'src/video/entities/video.entity';

@Entity({ name: 'keywords' })
export class Keyword extends CoreEntity {
  @Column({ type: 'varchar', length: 255 })
  keyword: string;

  @Column({ type: 'int', default: 1, comment: '1: مبتدئ، 2: متوسط، 3: متقدم' })
  user_level: number;

  // @ManyToOne(() => Transcript, transcript => transcript.keywords, { onDelete: 'CASCADE' })
  // @JoinColumn({ name: 'transcript_id' })
  // transcript: Transcript;

  // @Column({ type: 'uuid' })
  // @RelationId((keyword: Keyword) => keyword.transcript)
  // transcript_id: string;

  @ManyToOne(() => Video, (video) => video.keywords, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'video_id' })
  video: Video;

  @Column()
  @RelationId((transcript: Transcript) => transcript.video)
  video_id: number;
}
