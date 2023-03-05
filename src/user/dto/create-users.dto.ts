import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class CreateUserDto {
  @ApiPropertyOptional({
    description: 'phone number of the user',
  })
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  @Matches(/^[6-9]\d{9}$/)
  phone_no: string;
  id: number;
}

//
// import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
// import {
//
//   IsNumber,
//   IsOptional,
//   IsString,
//
// } from 'class-validator';
// export class CreateUsersDto {
//
//   @IsNumber()
//   @ApiProperty()
//   category_id: number;
//
//   @ApiProperty()
//   @IsString()
//   name: string;
//
//   @IsNumber()
//   @ApiProperty()
//   id: number;
//
//   @IsNumber()
//   @ApiPropertyOptional()
//   price: number;
//
//   @ApiPropertyOptional()
//   @IsString()
//   @IsOptional()
//   product_name: string;
//
//   @ApiPropertyOptional()
//   @IsString()
//   @IsOptional()
//   packet_description: string;
//
//   @IsNumber()
//   @ApiProperty()
//   quantity: number;
//
//   @ApiPropertyOptional()
//   @IsOptional()
//   is_active: boolean;
//
//
// }
//
