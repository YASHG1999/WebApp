import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {Column} from "typeorm";

export class CreateAddressDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  id: bigint;

  @IsOptional()
  @IsString()
  @ApiProperty()
  user_id: string;

  @ApiPropertyOptional()
  @IsOptional()
  country: string;



  @IsBoolean()
  @ApiPropertyOptional()
  @IsOptional()
  is_default: boolean;

  @ApiProperty()
  @IsString()
  address_line1: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  address_line2: string;

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




