import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersEntity} from "./entities/users.entity";
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';



@Module({
  imports: [
    JwtModule.register({}),
    TypeOrmModule.forFeature([
      UsersEntity,
      
  
    ]),
  ],
  providers: [UsersService,  ConfigService],
  controllers: [UsersController],
})
export class UsersModule {}


