import { DataSource, In, Repository } from 'typeorm';
import {Body, Delete, Get, HttpException, HttpStatus, Injectable, Param, Patch} from '@nestjs/common';
import { OrderEntity } from './order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {CategoryEntity} from "../category/entity/category.entity";
import {  ApiBody} from "@nestjs/swagger";
import {UpdateUserDto} from "../user/dto/update-user.dto";
import {UserDto} from "../user/dto/user.dto";
import {Roles} from "../core/common/custom.decorator";
import {id} from "date-fns/locale";
import {UpdateOrderDto} from "./dto/UpdateOrderDto";


@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @InjectRepository(OrderEntity)
    private readonly orderItemsRepository: Repository<OrderEntity>,
    private datasource: DataSource,
  ) {}

  async getNewOrders() {
    return await this.orderRepository.find({
      where: {
        status: 1,
        // active: 1,
      },
    });
  }

  async getAllOrder() {
    const orderRepository = this.datasource.getRepository(OrderEntity);
    return await orderRepository.find({where:{is_active:true}});
  }

  @Get(':id')

  async getOrderById() {
  }
  getOrder(@Param('id') id: string){
    const order = this.orderRepository
    if (order == null) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }
    return OrderEntity;
  }
//user id provide krega vo kese code krna h?


  async deleteOrder(Id) {
    await this.orderRepository.delete({
      order_id: Id,
    });

    await this.orderRepository.update({ order_id: Id }, { is_deleted: true });

    return {
      success: true,
      message: 'Your order is deleted successfully',
    };
  }

}