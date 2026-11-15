import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ResendOtpDto {
    @ApiProperty({
        description: 'Email identity of user',
        example: 'parent@example.com',
    })
    @IsEmail()
    @IsNotEmpty()
    identity: string;
}
