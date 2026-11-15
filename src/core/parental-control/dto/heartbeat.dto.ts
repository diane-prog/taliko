import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class HeartbeatDto {
  @ApiProperty({
    description: 'Child profile UUID',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  })
  @IsUUID()
  @IsNotEmpty()
  profileId: string;

  @ApiProperty({
    description: 'Minutes active since last heartbeat (usually 1 or 2)',
    example: 1,
    required: false,
  })
  @IsInt()
  @Min(1)
  @Max(10)
  @IsOptional()
  minutesElapsed?: number;
}
