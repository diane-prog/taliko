import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../../../libs/database/abstract.entity';
import { ChildProfile } from '../../profiles/entities/child-profile.entity';
import { LanguageEnum } from '../../../common/enum/languages.enum';

export enum ActivityTypeEnum {
  STORY = 'story',
  GAME = 'game',
  COLORING = 'coloring',
  MUSIC = 'music',
}

@Entity('activity_logs')
export class ActivityLog extends AbstractEntity<ActivityLog> {
  @Index()
  @ManyToOne(() => ChildProfile, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'profileId' })
  profile: ChildProfile;

  @Column({
    type: 'enum',
    enum: ActivityTypeEnum,
    default: ActivityTypeEnum.STORY,
  })
  activityType: ActivityTypeEnum;

  @Column({ nullable: true })
  referenceId?: string;

  @Column({ type: 'int', default: 0 })
  durationSeconds: number;

  @Column({ type: 'int', default: 0 })
  starsEarned: number;

  @Column({
    type: 'enum',
    enum: LanguageEnum,
    default: LanguageEnum.FRENCH,
  })
  language: LanguageEnum;
}
