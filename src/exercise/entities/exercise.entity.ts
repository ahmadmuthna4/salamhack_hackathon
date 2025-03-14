// exercise.entity.ts
import { CoreEntity } from "../../common/entities/core.entity";
import { Column, Entity, JoinColumn, ManyToOne, RelationId } from "typeorm";
import { Podcast } from "../../podcast/entities/podcast.entity";

@Entity({ name: 'exercises' })
export class Exercise extends CoreEntity {


  @Column({ type: 'text' })
  question: string;

  @Column({ type: 'text', array: true })
  answer_choices: string[];

  @Column({ type: 'text' })
  correct_answer: string;

  @ManyToOne(() => Podcast, podcast => podcast.exercises, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'podcast_id' })
  podcast: Podcast;

  @Column({})
  @RelationId((exercise: Exercise) => exercise.podcast)
  podcast_id: number;
}
