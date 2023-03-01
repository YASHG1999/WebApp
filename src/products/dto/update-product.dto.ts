import { ApiPropertyOptional } from '@nestjs/swagger';

import {

  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateProductDto {
 
  @IsNumber()
  @ApiPropertyOptional()
  @IsOptional()
  id: number;

  @IsNumber()
  @ApiPropertyOptional()
  @IsOptional()
  category_id: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name: string;

  @IsNumber()
  @ApiPropertyOptional()
  @IsOptional()
  price: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  product_name: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  packet_description: string;

  @IsNumber()
  @ApiPropertyOptional()
  @IsOptional()
  quantity: number;

  @ApiPropertyOptional()
  @IsOptional()
  is_active: boolean;

  
}
