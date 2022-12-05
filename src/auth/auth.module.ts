import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { JwtTokenService } from '../core/jwt-token/jwt-token.service';
import { HttpModule } from '@nestjs/axios';
import { SmsService } from '../core/sms/sms.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/user.entity';
import { ConfigService } from '@nestjs/config';
import { RefreshTokenEntity } from './refresh-token.entity';
import { OtpTokensEntity } from './otp-tokens.entity';
import { DevicesEntity } from '../user/devices.entity';
import { UserStoreMappingService } from '../user_store/user-store-mapping.service';
import { UserStoreMappingEntity } from '../user_store/user-store-mapping.entity';

@Module({
  imports: [
    JwtModule.register({}),
    HttpModule,
    TypeOrmModule.forFeature([
      UserEntity,
      RefreshTokenEntity,
      OtpTokensEntity,
      DevicesEntity,
      UserStoreMappingEntity,
    ]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    JwtTokenService,
    SmsService,
    ConfigService,
    UserStoreMappingService,
  ],
})
export class AuthModule {}
