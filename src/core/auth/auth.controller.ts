import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { VerifyPinDto } from './dto/verify-pin.dto';
import { Public } from '../../common/decorators/public.decorator';
import { JwtAuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Users } from '../users/entities/users.entity';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Public()
    @Post('register')
    @ApiOperation({ summary: '1. Register a new parent account with 4-digit PIN' })
    register(@Body() dto: RegisterDto) {
        return this.authService.register(dto);
    }

    @Public()
    @Post('login')
    @ApiOperation({
        summary: '2. Login with credentials and receive a 6-digit OTP code',
    })
    login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }

    @Public()
    @Post('verify-otp')
    @ApiOperation({
        summary: '3. Verify OTP code and receive JWT access tokens',
    })
    verifyOtp(@Body() dto: VerifyOtpDto) {
        return this.authService.verifyOtp(dto);
    }

    @Public()
    @Post('resend-otp')
    @ApiOperation({
        summary: 'Resend a fresh 6-digit OTP code to email',
    })
    resendOtp(@Body() dto: ResendOtpDto) {
        return this.authService.resendOtp(dto);
    }

    @ApiBearerAuth('JWT')
    @UseGuards(JwtAuthGuard)
    @Post('verify-pin')
    @ApiOperation({
        summary: 'Verify parental 4-digit PIN for sensitive actions and purchases',
    })
    verifyPin(@CurrentUser() user: Users, @Body() dto: VerifyPinDto) {
        return this.authService.verifyParentalPin(user.id, dto.pin);
    }
}
