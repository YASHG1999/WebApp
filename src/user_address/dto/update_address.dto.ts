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
  @IsOptional()
  id: bigint;

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
  @IsOptional()
  city: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  state: string;

  @IsInt()
  @ApiPropertyOptional()
  @IsOptional()
  pincode: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  contact_number: string;
}
