import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ description: 'Role identifier name', example: 'parent' })
  @IsString()
  @IsNotEmpty()
  label: string;

  @ApiProperty({
    description: 'Description of permissions',
    example: 'Parent user with child profiles',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
