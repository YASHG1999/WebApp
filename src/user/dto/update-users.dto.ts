
import {IsBoolean, IsEmail, IsOptional, IsString , IsNumber} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';


export class UpdateUserDto {

  @IsNumber()
  @ApiPropertyOptional()
  @IsOptional()
  id: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString ()
  firstName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  phone_number?: number;

}
