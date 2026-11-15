import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../../../libs/database/abstract.entity';
import { Users } from '../../users/entities/users.entity';
import { AgeGroupEnum } from '../../../common/enum/age-group.enum';
import { LanguageEnum } from '../../../common/enum/languages.enum';

@Entity('child_profiles')
export class ChildProfile extends AbstractEntity<ChildProfile> {
  @Column({ nullable: false })
  name: string;

  @Column({ default: 'avatar-lion' })
  avatar: string;

  @Column({
    type: 'enum',
    enum: AgeGroupEnum,
    default: AgeGroupEnum.EARLY_5_7,
  })
  ageGroup: AgeGroupEnum;

  @Column({
    type: 'enum',
    enum: LanguageEnum,
    default: LanguageEnum.FRENCH,
  })
  preferredLanguage: LanguageEnum;

  @Index()
  @ManyToOne(() => Users, (user) => user.children, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'parentId' })
  parent: Users;

  @Column({ type: 'int', default: 30 })
  screenTimeLimitMinutes: number;

  @Column({ type: 'int', default: 0 })
  dailyScreenTimeUsedMinutes: number;

  @Column({ type: 'varchar', nullable: true })
  lastScreenTimeDate: string;

  @Column({ type: 'int', default: 0 })
  stars: number;

  @Column({ type: 'int', default: 1 })
  level: number;

  @Column({ type: 'boolean', default: false })
  isLocked: boolean;
}
