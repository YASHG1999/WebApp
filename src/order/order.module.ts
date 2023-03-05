import { Module } from '@nestjs/common';
import { CommonService } from '../core/common/common.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderService } from './order.service';
import { OrderEntity } from './order.entity';
import { OrderController } from './order.controller';
import {CommonEntity} from "../core/common/common.entity";



@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity, OrderEntity , CommonEntity])],
  providers: [OrderService, CommonService],
  controllers: [OrderController],
})
export class OrderModule {}
