import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { AgeGroupEnum } from '../../../common/enum/age-group.enum';
import { LanguageEnum } from '../../../common/enum/languages.enum';

export class CreateChildProfileDto {
  @ApiProperty({
    description: "Child's first name or nickname",
    example: 'Amina',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Avatar slug',
    example: 'avatar-gazelle',
    required: false,
  })
  @IsString()
  @IsOptional()
  avatar?: string;

  @ApiProperty({
    description: 'Age group bracket',
    enum: AgeGroupEnum,
    example: AgeGroupEnum.EARLY_5_7,
  })
  @IsEnum(AgeGroupEnum)
  ageGroup: AgeGroupEnum;

  @ApiProperty({
    description: 'Preferred spoken language',
    enum: LanguageEnum,
    example: LanguageEnum.YORUBA,
  })
  @IsEnum(LanguageEnum)
  preferredLanguage: LanguageEnum;

  @ApiProperty({
    description: 'Daily screen time limit in minutes',
    example: 30,
    required: false,
  })
  @IsInt()
  @Min(5)
  @Max(180)
  @IsOptional()
  screenTimeLimitMinutes?: number;
}
