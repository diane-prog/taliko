import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../../../libs/database/abstract.entity';
import { AgeGroupEnum } from '../../../common/enum/age-group.enum';
import { LanguageEnum } from '../../../common/enum/languages.enum';

export enum GameTypeEnum {
  ALPHABET = 'alphabet',
  MATH = 'math',
  MEMORY = 'memory',
  QUIZ = 'quiz',
  ANIMALS_NATURE = 'animals_nature',
}

@Entity('game_questions')
export class GameQuestion extends AbstractEntity<GameQuestion> {
  @Column({
    type: 'enum',
    enum: GameTypeEnum,
    default: GameTypeEnum.QUIZ,
  })
  gameType: GameTypeEnum;

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
  language: LanguageEnum;

  @Column({ nullable: false })
  prompt: string;

  @Column({ nullable: true })
  promptAudioUrl?: string;

  @Column({ nullable: true })
  imageUrl?: string;

  @Column({ type: 'simple-array', nullable: false })
  options: string[];

  @Column({ nullable: false })
  correctAnswer: string;

  @Column({ nullable: true })
  explanation?: string;

  @Column({ type: 'int', default: 10 })
  starsReward: number;
}
