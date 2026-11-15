import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { UsersService } from '../users/users.service';
import { RolesService } from '../roles/roles.service';
import { PasswordHashService } from '../../helpers/password_hash/passwordHash.service';
import { ErrorHandlingService } from '../../common/response/errorHandler.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { OtpService } from './services/otp.service';
import { Users } from '../users/entities/users.entity';
import { UserRoleEnum } from '../../common/enum/user.enum';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly rolesService: RolesService,
        private readonly passwordHashService: PasswordHashService,
        private readonly otpService: OtpService,
        private readonly configService: ConfigService,
        private readonly errorHandler: ErrorHandlingService,
    ) {}

    async register(dto: RegisterDto) {
        const existing = await this.usersService.findByEmail(dto.email);
        if (existing) {
            this.errorHandler.returnErrorOnConflict(
                `Email ${dto.email} already registered`,
                'An account with this email already exists',
            );
        }

        let parentRole = await this.rolesService.findByLabel(UserRoleEnum.PARENT);
        if (!parentRole) {
            parentRole = await this.rolesService.create({
                label: UserRoleEnum.PARENT,
                description: 'Parent account',
            });
        }

        const passwordHash = await this.passwordHashService.hashPassword(
            dto.password,
        );
        const parentalPinHash = await this.passwordHashService.hashPassword(
            dto.parentalPin,
        );

        const newUser = new Users({
            fullname: dto.fullname,
            email: dto.email.toLowerCase().trim(),
            passwordHash,
            parentalPinHash,
            role: parentRole,
            preferredLanguage: dto.preferredLanguage,
            children: [],
        });

        const createdUser = await this.usersService.create(newUser);

        return {
            message:
                'Compte créé avec succès. Vous pouvez maintenant vous connecter.',
            user: {
                id: createdUser.id,
                fullname: createdUser.fullname,
                email: createdUser.email,
                role: createdUser.role.label,
                plan: createdUser.plan,
            },
        };
    }

    async login(dto: LoginDto) {
        const user = await this.usersService.findByEmail(dto.email);
        if (!user) {
            this.errorHandler.returnErrorOnUnauthorized(
                `Login failed for ${dto.email}: user not found`,
                'Invalid email or password',
            );
        }

        const isPasswordValid = await this.passwordHashService.comparePassword(
            dto.password,
            user!.passwordHash,
        );

        if (!isPasswordValid) {
            this.errorHandler.returnErrorOnUnauthorized(
                `Login failed for ${dto.email}: invalid password`,
                'Invalid email or password',
            );
        }

        // Generate 6-digit OTP code and send via email
        const code = await this.otpService.generateOtp(user!.email);
        await this.otpService.sendOtpEmail(user!.email, code, user!.fullname);

        return {
            requireOtp: true,
            identity: user!.email,
            message:
                'Identifiants valides. Un code de vérification à 6 chiffres a été envoyé à votre adresse email.',
        };
    }

    async verifyOtp(dto: VerifyOtpDto) {
        const isValid = await this.otpService.verifyOtp(dto.identity, dto.code);
        if (!isValid) {
            throw new BadRequestException(
                'Code de vérification invalide ou expiré',
            );
        }

        const user = await this.usersService.findByEmail(dto.identity);
        if (!user) {
            throw new NotFoundException('Utilisateur introuvable');
        }

        await this.usersService.markEmailVerified(user.id);
        await this.usersService.update(user.id, {
            lastLoginAt: new Date(),
        });

        const tokens = this.generateTokens(user);

        return {
            user: {
                id: user.id,
                fullname: user.fullname,
                email: user.email,
                role: user.role.label,
                plan: user.plan,
                children: user.children || [],
            },
            ...tokens,
        };
    }

    async resendOtp(dto: ResendOtpDto) {
        const user = await this.usersService.findByEmail(dto.identity);
        if (!user) {
            throw new NotFoundException('Utilisateur introuvable');
        }

        const code = await this.otpService.generateOtp(user.email);
        await this.otpService.sendOtpEmail(user.email, code, user.fullname);

        return {
            success: true,
            identity: user.email,
            message: 'Un nouveau code de vérification a été envoyé à votre adresse email.',
        };
    }

    async verifyParentalPin(userId: string, pin: string): Promise<{ valid: boolean }> {
        const user = await this.usersService.findById(userId);
        if (!user) {
            this.errorHandler.returnErrorOnNotFound(
                `User ${userId} not found during PIN verification`,
                'User not found',
            );
        }

        const isValid = await this.passwordHashService.comparePassword(
            pin,
            user!.parentalPinHash,
        );

        if (!isValid) {
            this.errorHandler.returnErrorOnForbidden(
                `Invalid parental PIN for user ${userId}`,
                'Incorrect parental PIN',
            );
        }

        return { valid: true };
    }

    private generateTokens(user: Users): {
        accessToken: string;
        refreshToken: string;
    } {
        const jwtSecret = this.configService.get<string>('auth.jwtSecret')!;
        const jwtExpiration = this.configService.get<string>(
            'auth.jwtExpirationTime',
        )!;
        const refreshSecret = this.configService.get<string>(
            'auth.jwtRefreshSecret',
        )!;
        const refreshExpiration = this.configService.get<string>(
            'auth.jwtRefreshExpirationTime',
        )!;

        const payload = {
            id: user.id,
            email: user.email,
            role: user.role.label,
        };

        const accessToken = jwt.sign(payload, jwtSecret, {
            expiresIn: jwtExpiration as any,
        });

        const refreshToken = jwt.sign(payload, refreshSecret, {
            expiresIn: refreshExpiration as any,
        });

        return { accessToken, refreshToken };
    }
}
