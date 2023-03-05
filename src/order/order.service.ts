import { DataSource, In, Repository } from 'typeorm';
import {Body, Delete, Get, HttpException, HttpStatus, Injectable, Param, Patch} from '@nestjs/common';
import { OrderEntity } from './order.entity';
import { InjectRepository } from '@nestjs/typeorm';
// import {Roles} from "../core/common/custom.decorator";
import {id} from "date-fns/locale";
import {UpdateOrderDto} from "./dto/UpdateOrderDto";
import { CommonEntity} from "../core/common/common.entity";
import {CreateOrderDto} from "./dto/CreateOrder.Dto";


@Injectable()
export class OrderService {
  constructor(

    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @InjectRepository(OrderEntity)
    private readonly orderItemsRepository: Repository<OrderEntity>,
    private datasource: DataSource,
    @InjectRepository(CommonEntity)
    private readonly commonEntity: Repository<CommonEntity>,
  ) {}

  // async getNewOrders() {
  //   return await this.orderRepository.find({
  //     where: {
  //       status: 1,
  //       // active: 1,
  //     },
  //   });
  // }
  // async createCategory(
  //     categoryBody: CreateCategoryDto,
  //     updatedBy: string,
  // ) {
  //   let category: CategoryEntity = null;
  //
  //   category = await this.categoryRepository.save({
  //     ...categoryBody,
  //     updated_by: updatedBy,
  //   });
  //   return category;
  // }

  async createOrder(
      orderBody: CreateOrderDto,
      updatedBy: string,
  ){
    let order: OrderEntity = null;
    order = await this.orderRepository.save({
      ...orderBody,
      updated_by: updatedBy,
    });
    // order = await this.orderRepository.save({
    //   ...orderBody,
    //   updated_by: updatedBy,
    // });

    return order;
  }

  async updateOrder(
      orderBody: UpdateOrderDto,
      orderId: number,
      updatedBy: string,
  ) {
    let category = null;
    console.log(orderBody)
    let existingOrder:OrderEntity = null;

    existingOrder = await this.orderRepository.findOneBy({ id : orderId});
    existingOrder.product_name = orderBody.product_name;
    await this.orderRepository.save(existingOrder);
    return existingOrder;
//save and return
  }

  async getAllOrder() {
    const orderRepository = this.datasource.getRepository(OrderEntity);
    return await orderRepository.find({where:{is_active:true}});
  }



  async getOrderById(id: number) {
  // }
  // getOrder(@Param('id') id: number){
    const order = this.orderRepository.findOneBy({id})
    if (order == null) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }
    return order;
  }

  // async getUserFromId(id: string): Promise<UserDto> {
  //   const user = await this.userRepository.findOne({
  //     where: { id: id },
  //   });
  //   return user;
  // auth service}
// user id provide krega vo kese code krna h?
  //
  //
  // async deleteUser(id: number) {
  //   const a = await this.usersRepository.findOneBy({id:id});
  //   a.is_active=false;
  //   await this.usersRepository.save(a);
  //   return a;
  // }
//   const order = await this.orderRepository.findOneBy({ id });
//   if (!order) {
//   throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
// }
// return order;
// }

  async deleteOrder(Id) {
    await this.orderRepository.delete({
      user_id: Id,
    });

    await this.orderRepository.update({ user_id: Id }, { is_deleted: true });

    return {
      success: true,
      message: 'Your order is deleted successfully',
    };
  }

}