import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  
  IsNumber,
  IsOptional,
  IsString,
  
} from 'class-validator';
export class CreateProductDto {
  
  @IsNumber()
  @ApiProperty()      
  category_id: number;

  @ApiProperty()
  @IsString()
  name: string;

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
  packet_description: string;

  @IsNumber()
  @ApiProperty()
  quantity: number;

  @ApiPropertyOptional()
  @IsOptional()
  is_active: boolean;

  
}
