import { Module } from '@nestjs/common';
import { CommonService } from '../core/common/common.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserStoreMappingService } from './user-store-mapping.service';
import { UserStoreMappingEntity } from './user-store-mapping.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserStoreMappingEntity])],
  providers: [UserStoreMappingService, CommonService],
})
export class UserStoreMappingModule {}
