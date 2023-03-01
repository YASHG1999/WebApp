import {ApiProperty, ApiPropertyOptional} from '@nestjs/swagger';

import {

    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator';

export class UpdateOrderDto {

    @IsNumber()
    @ApiProperty()
    Order_id: number;

    @IsNumber()
    @ApiProperty()
    id: number;

    @IsNumber()
    @ApiPropertyOptional()
    final_amount: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    product_name: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    status: number;

    @IsNumber()
    @ApiProperty()
    order_quantity: string;

    @ApiPropertyOptional()
    @IsOptional()
    is_active: boolean;

    @IsNumber()
    @ApiPropertyOptional()
    order_sumbitted_at: string;


}
