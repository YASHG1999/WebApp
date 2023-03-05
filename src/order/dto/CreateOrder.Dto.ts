import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {

    IsNumber,
    IsOptional,
    IsString,

} from 'class-validator';
export class CreateOrderDto {
    @IsNumber()
    @ApiProperty()
    Order_id: number;

    @IsNumber()
    @ApiProperty()
    id: number;

    @IsNumber()
    @ApiPropertyOptional()
    price: number;

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
    quantity: number;

    @ApiPropertyOptional()
    @IsOptional()
    is_active: boolean;

    @IsNumber()
    @ApiPropertyOptional()
    order_submitted_at: string;


}


