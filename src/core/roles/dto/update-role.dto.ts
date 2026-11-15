import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateRoleDto {
  @ApiProperty({ description: 'Role identifier name', required: false })
  @IsString()
  @IsOptional()
  label?: string;

  @ApiProperty({ description: 'Description of permissions', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}
