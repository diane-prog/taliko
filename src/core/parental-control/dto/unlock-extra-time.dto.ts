import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsString,
  IsUUID,
  Length,
  Matches,
  Max,
  Min,
} from 'class-validator';

export class UnlockExtraTimeDto {
  @ApiProperty({ description: 'Child profile UUID' })
  @IsUUID()
  @IsNotEmpty()
  profileId: string;

  @ApiProperty({ description: 'Additional minutes to grant', example: 15 })
  @IsInt()
  @Min(5)
  @Max(120)
  extraMinutes: number;

  @ApiProperty({ description: '4-digit parental PIN', example: '1234' })
  @IsString()
  @Length(4, 4)
  @Matches(/^\d{4}$/, { message: 'PIN must be 4 digits' })
  pin: string;
}
