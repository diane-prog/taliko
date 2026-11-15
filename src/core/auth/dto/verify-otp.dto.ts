import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class VerifyOtpDto {
    @ApiProperty({
        description: 'Email identity of user',
        example: 'parent@example.com',
    })
    @IsEmail()
    @IsNotEmpty()
    identity: string;

    @ApiProperty({
        description: '6-digit OTP code received by email',
        example: '123456',
    })
    @IsString()
    @IsNotEmpty()
    @Length(6, 6)
    @Matches(/^\d{6}$/, { message: 'OTP code must be exactly 6 digits' })
    code: string;
}
