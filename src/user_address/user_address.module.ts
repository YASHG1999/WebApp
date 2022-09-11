import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CommonService } from '../core/common/common.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAddress } from './user_address.entity';
import { UserAddressService } from './user_address.service';
import { UserAddressController } from './user_address.controller';

@Module({
  imports: [JwtModule.register({}), TypeOrmModule.forFeature([UserAddress])],
  providers: [UserAddressService, CommonService],
  controllers: [UserAddressController],
})
export class UserAddressModule {}
