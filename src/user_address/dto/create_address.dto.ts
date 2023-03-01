import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAddressDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name: string;

  @IsString()
  type: string;


  @IsBoolean()
  @ApiPropertyOptional()
  @IsOptional()
  is_default: boolean;

  @ApiProperty()
  @IsString()
  address_line_1: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  address_line_2: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  landmark: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  city: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  state: string;

  @IsInt()
  @IsOptional()
  pincode: number;


}
