import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CommonService } from '../core/common/common.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAddressEntity } from './user_address.entity';
import { UserAddressService } from './user_address.service';
import { UserAddressController } from './user_address.controller';
// import { UserAddressAdminController } from './user_address.admin.controller';

@Module({
  imports: [
    JwtModule.register({}),
    TypeOrmModule.forFeature([UserAddressEntity]),
  ],
  providers: [UserAddressService, CommonService],
  controllers: [
    UserAddressController,
    // UserAddressAdminController,
  ],
})
export class UserAddressModule {}
