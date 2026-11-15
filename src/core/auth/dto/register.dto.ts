import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
  MinLength,
} from 'class-validator';
import { LanguageEnum } from '../../../common/enum/languages.enum';

export class RegisterDto {
  @ApiProperty({ description: 'Parent full name', example: 'Amina Diallo' })
  @IsString()
  @IsNotEmpty()
  fullname: string;

  @ApiProperty({ description: 'Parent email', example: 'parent@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Account password', example: 'Secret123!' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: '4-digit parental security PIN',
    example: '1234',
  })
  @IsString()
  @Length(4, 4)
  @Matches(/^\d{4}$/, { message: 'Parental PIN must be exactly 4 digits' })
  parentalPin: string;

  @ApiProperty({
    description: 'Preferred family language',
    enum: LanguageEnum,
    example: LanguageEnum.FRENCH,
    required: false,
  })
  @IsEnum(LanguageEnum)
  @IsOptional()
  preferredLanguage?: LanguageEnum;
}
