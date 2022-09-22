import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CommonService } from '../core/common/common.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAddressEntity } from './user_address.entity';
import { UserAddressService } from './user_address.service';
import { UserAddressController } from './user_address.controller';
import { UserAddressInternalController } from './user_address.internal.controller';

@Module({
  imports: [
    JwtModule.register({}),
    TypeOrmModule.forFeature([UserAddressEntity]),
  ],
  providers: [UserAddressService, CommonService],
  controllers: [UserAddressController, UserAddressInternalController],
})
export class UserAddressModule {}
