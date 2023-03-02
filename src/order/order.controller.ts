
import {
    Body,
    Controller,
    Post,
    UseFilters,
    Patch,
    Param,
    Get,
    Delete,
    Headers, HttpStatus, HttpException,
} from '@nestjs/common';
import { ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/createOrder.dto';
import {UpdateOrderDto} from "./dto/UpdateOrderDto";


@Controller('order')
@ApiTags('order')
export class OrderController {
    constructor(private orderService: OrderService) {}

    @ApiBody({type: CreateOrderDto})
    @Post('/create')
    createOrder(
        @Body() reqBody: CreateOrderDto,
        @Headers('userId') createdBy: string,
    ) {
        return this.orderService.getNewOrders();
    }

    @Get(':id')
    async getOrder(@Param('id') id: string){
        const order = await this.orderService.getOrderById();
        if (order == null) {
            throw new HttpException('user not found', HttpStatus.NOT_FOUND);
        }
        return order;
    }
    @Get('/orderAll')
    async getAllOrder() {
        return await this.orderService.getAllOrder();
    }


    @Delete('delete')
    deleteOrder(@Headers('orderId') orderId) {
        const a = this.orderService.deleteOrder(orderId);
        return a;
    }





}

