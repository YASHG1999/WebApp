import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../prisma/prisma.module';
import { UserService } from '../user/user.service';
import { JwtTokenService } from '../core/jwt-token/jwt-token.service';
import { HttpModule } from '@nestjs/axios';
import { SmsService } from '../core/sms/sms.service';
import { CommonService } from '../core/common/common.service';

@Module({
  imports: [JwtModule.register({}), PrismaModule, HttpModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    JwtTokenService,
    SmsService,
    CommonService,
  ],
})
export class AuthModule {}
