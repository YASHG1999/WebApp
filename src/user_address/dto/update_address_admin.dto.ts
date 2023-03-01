import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateAddressAdminDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  type: string;

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
