import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../../../libs/database/abstract.entity';
import { LanguageEnum } from '../../../common/enum/languages.enum';

export enum MusicTypeEnum {
  NURSERY_RHYME = 'nursery_rhyme',
  EDUCATIONAL_SONG = 'educational_song',
  TRADITIONAL_INSTRUMENT = 'traditional_instrument',
}

@Entity('music_tracks')
export class MusicTrack extends AbstractEntity<MusicTrack> {
  @Column({ nullable: false })
  title: string;

  @Column({
    type: 'enum',
    enum: MusicTypeEnum,
    default: MusicTypeEnum.NURSERY_RHYME,
  })
  type: MusicTypeEnum;

  @Column({
    type: 'enum',
    enum: LanguageEnum,
    default: LanguageEnum.FRENCH,
  })
  language: LanguageEnum;

  @Column({ nullable: false })
  audioUrl: string;

  @Column({ nullable: true })
  coverImageUrl?: string;

  @Column({ nullable: true })
  instrumentName?: string; // e.g. 'Kora', 'Balafon', 'Djembé', 'Talking Drum'

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'int', default: 0 })
  durationSeconds: number;
}
