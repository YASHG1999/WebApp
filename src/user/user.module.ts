import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtTokenService } from '../core/jwt-token/jwt-token.service';
import { JwtModule } from '@nestjs/jwt';
import { CommonService } from '../core/common/common.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';

@Module({
  imports: [JwtModule.register({}), TypeOrmModule.forFeature([UserEntity])],
  providers: [UserService, JwtTokenService, CommonService],
  controllers: [UserController],
})
export class UserModule {}
