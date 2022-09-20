import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtTokenService } from '../core/jwt-token/jwt-token.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [JwtModule.register({}), TypeOrmModule.forFeature([UserEntity])],
  providers: [UserService, JwtTokenService, ConfigService],
  controllers: [UserController],
})
export class UserModule {}
