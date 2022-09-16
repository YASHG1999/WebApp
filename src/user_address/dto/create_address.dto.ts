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

export class CreateAddressDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name: string;

  @IsString()
  @IsEnum(AddressType)
  @ApiProperty({ enumName: 'AddressType', enum: AddressType })
  type: AddressType;

  @IsNumber()
  @ApiProperty()
  lat: number;

  @IsNumber()
  @ApiProperty()
  long: number;

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

  @ApiProperty()
  @IsString()
  @IsOptional()
  contact_number: string;
}
