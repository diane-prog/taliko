import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { AgeGroupEnum } from '../../../common/enum/age-group.enum';
import { LanguageEnum } from '../../../common/enum/languages.enum';

export class UpdateChildProfileDto {
  @ApiProperty({ description: "Child's name", required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: 'Avatar slug', required: false })
  @IsString()
  @IsOptional()
  avatar?: string;

  @ApiProperty({ enum: AgeGroupEnum, required: false })
  @IsEnum(AgeGroupEnum)
  @IsOptional()
  ageGroup?: AgeGroupEnum;

  @ApiProperty({ enum: LanguageEnum, required: false })
  @IsEnum(LanguageEnum)
  @IsOptional()
  preferredLanguage?: LanguageEnum;

  @ApiProperty({ description: 'Daily limit in minutes', required: false })
  @IsInt()
  @Min(5)
  @Max(180)
  @IsOptional()
  screenTimeLimitMinutes?: number;

  @ApiProperty({ description: 'Lock profile', required: false })
  @IsBoolean()
  @IsOptional()
  isLocked?: boolean;
}
