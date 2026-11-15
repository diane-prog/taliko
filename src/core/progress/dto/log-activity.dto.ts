import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { ActivityTypeEnum } from '../entities/activity-log.entity';
import { LanguageEnum } from '../../../common/enum/languages.enum';

export class LogActivityDto {
  @ApiProperty({ description: 'Child profile UUID' })
  @IsUUID()
  @IsNotEmpty()
  profileId: string;

  @ApiProperty({ enum: ActivityTypeEnum, example: ActivityTypeEnum.STORY })
  @IsEnum(ActivityTypeEnum)
  activityType: ActivityTypeEnum;

  @ApiProperty({
    description: 'UUID of story, game, artwork, or song',
    required: false,
  })
  @IsString()
  @IsOptional()
  referenceId?: string;

  @ApiProperty({
    description: 'Duration in seconds spent on the activity',
    example: 180,
  })
  @IsInt()
  @Min(1)
  durationSeconds: number;

  @ApiProperty({
    description: 'Stars earned from this activity',
    example: 10,
    required: false,
  })
  @IsInt()
  @IsOptional()
  starsEarned?: number;

  @ApiProperty({
    enum: LanguageEnum,
    example: LanguageEnum.YORUBA,
    required: false,
  })
  @IsEnum(LanguageEnum)
  @IsOptional()
  language?: LanguageEnum;
}
