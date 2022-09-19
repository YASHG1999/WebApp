import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { UserEntity } from './src/user/user.entity';
import { OtpTokensEntity } from './src/auth/otp-tokens.entity';
import { RefreshTokenEntity } from './src/auth/refresh-token.entity';
import { DevicesEntity } from './src/user/devices.entity';

config();

const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  url: configService.get('DATABASE_URL'),
  entities: [UserEntity, OtpTokensEntity, RefreshTokenEntity, DevicesEntity],
  migrations: ['migrations/*'],
  migrationsTableName: 'auth.auth_migration',
  synchronize: false,
});
