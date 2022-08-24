import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtTokenService } from '../core/jwt-token/jwt-token.service';
import { JwtModule } from '@nestjs/jwt';
import { CommonService } from '../core/common/common.service';

@Module({
  imports: [JwtModule.register({})],
  providers: [UserService, JwtTokenService, CommonService],
  controllers: [UserController],
})
export class UserModule {}
