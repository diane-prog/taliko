import { registerAs } from '@nestjs/config';

export default registerAs('storage', () => ({
  cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  apiKey: process.env.CLOUDINARY_API_KEY,
  apiSecret: process.env.CLOUDINARY_API_SECRET,
  mediaBaseUrl: process.env.MEDIA_BASE_URL ?? 'https://cdn.taliko.app',
}));
