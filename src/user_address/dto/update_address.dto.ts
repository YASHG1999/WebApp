import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AddressType } from '../enum/address.enum';

export class UpdateAddressDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsEnum(AddressType)
  @ApiPropertyOptional({ enumName: 'AddressType', enum: AddressType })
  @IsOptional()
  type: AddressType;

  @IsNumber()
  @ApiPropertyOptional()
  @IsOptional()
  lat: number;

  @IsNumber()
  @ApiProperty()
  @IsOptional()
  long: number;

  @IsBoolean()
  @ApiPropertyOptional()
  @ApiPropertyOptional()
  @IsOptional()
  is_default: boolean;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  address_line_1: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  address_line_2: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  landmark: string;

  @ApiPropertyOptional()
  @IsString()
  city: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  state: string;

  @IsInt()
  @ApiPropertyOptional()
  @IsOptional()
  pincode: number;

  @IsBoolean()
  @ApiPropertyOptional()
  is_active: boolean;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  contact_number: string;
}
