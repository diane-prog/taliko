import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  jwtSecret: process.env.JWT_SECRET ?? 'taliko-jwt-secret-key-change-in-prod',
  jwtExpirationTime: process.env.JWT_EXPIRATION_TIME ?? '1d',
  jwtRefreshSecret:
    process.env.JWT_REFRESH_SECRET ??
    'taliko-jwt-refresh-secret-key-change-in-prod',
  jwtRefreshExpirationTime: process.env.JWT_REFRESH_EXPIRATION_TIME ?? '7d',
}));
