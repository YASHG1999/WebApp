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
import {Column, PrimaryGeneratedColumn} from "typeorm";

export class UpdateAddressDto {
  @ApiPropertyOptional()
  @IsOptional()
  id: bigint;

  @ApiProperty()
  @IsOptional()
  @IsString()
  user_id: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name: string;


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

}







//
//
//
// @ApiPropertyOptional()
// @Column({ nullable: true })
// country: string;
//
//
//
// @ApiPropertyOptional()
// @Column({ default: true })
// is_active: boolean;
//
