import { IsNumber, IsString, IsOptional, IsInt } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAddressInternalDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  user_id: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  lithos_ref: number;

  @ApiProperty()
  @IsString()
  address_line_1: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  address_line_2: string;

  @IsNumber()
  @ApiPropertyOptional()
  @IsOptional()
  lat: number;

  @IsNumber()
  @ApiPropertyOptional()
  @IsOptional()
  long: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  landmark: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  city: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  state: string;

  @IsInt()
  @IsOptional()
  @ApiPropertyOptional()
  pincode: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  contact_number: string;
}
