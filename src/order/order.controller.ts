
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
import {UpdateCategoryDto} from "../category/dto/updateCategory.dto";
import {isNumber} from "class-validator";


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
        return this.orderService.createOrder(reqBody,createdBy);
    }


    @Patch('/:orderId')
    updateOrder(
        @Body() reqBody: UpdateOrderDto,
        @Param() param,
        @Headers('userId') createdBy: string,
    ) {
        const orderId = parseInt(param.orderId);
        return this.orderService.updateOrder(
            reqBody,
            orderId,
            createdBy,
        );
    }

    @Get(':id')
    async getOrder(@Param('id') id: number){
        const order = await this.orderService.getOrderById(id);
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

//path variable



}

