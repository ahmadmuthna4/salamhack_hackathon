// video.entity.ts
import { CoreEntity } from "../../common/entities/core.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, RelationId } from "typeorm";


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


}