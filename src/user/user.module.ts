import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtTokenService } from '../core/jwt-token/jwt-token.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { ConfigService } from '@nestjs/config';
import { RefreshTokenEntity } from '../auth/refresh-token.entity';
import { OtpTokensEntity } from '../auth/otp-tokens.entity';
import { DevicesEntity } from './devices.entity';
import { InternalUserController } from './user.internal.controller';

@Module({
  imports: [
    JwtModule.register({}),
    TypeOrmModule.forFeature([
      UserEntity,
      RefreshTokenEntity,
      OtpTokensEntity,
      DevicesEntity,
    ]),
  ],
  providers: [UserService, JwtTokenService, ConfigService],
  controllers: [UserController, InternalUserController],
})
export class UserModule {}
