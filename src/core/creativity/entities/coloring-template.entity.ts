import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../../../libs/database/abstract.entity';
import { AgeGroupEnum } from '../../../common/enum/age-group.enum';

@Entity('coloring_templates')
export class ColoringTemplate extends AbstractEntity<ColoringTemplate> {
  @Column({ nullable: false })
  title: string;

  @Column({ nullable: true })
  category: string; // e.g. 'animals', 'masks', 'village', 'instruments'

  @Column({
    type: 'enum',
    enum: AgeGroupEnum,
    default: AgeGroupEnum.EARLY_5_7,
  })
  ageGroup: AgeGroupEnum;

  @Column({ type: 'text', nullable: false })
  svgContent: string; // SVG vectors for interactive bucket fill or stroke

  @Column({ nullable: true })
  previewImageUrl?: string;
}
