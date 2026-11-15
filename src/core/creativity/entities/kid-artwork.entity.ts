import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../../../libs/database/abstract.entity';
import { ChildProfile } from '../../profiles/entities/child-profile.entity';

@Entity('kid_artworks')
export class KidArtwork extends AbstractEntity<KidArtwork> {
  @Index()
  @ManyToOne(() => ChildProfile, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'profileId' })
  profile: ChildProfile;

  @Column({ nullable: false })
  title: string;

  @Column({ type: 'text', nullable: false })
  drawingDataUrl: string; // Base64 or canvas JSON or Cloud URL

  @Column({ nullable: true })
  templateId?: string;
}
