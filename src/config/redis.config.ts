import { registerAs } from '@nestjs/config';

export default registerAs('redis', () => ({
  url: process.env.REDIS_URL,
  ttl: Number.parseInt(process.env.REDIS_DEFAULT_TTL ?? '3600', 10),
}));
