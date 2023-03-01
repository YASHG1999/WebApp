import {IsBoolean, IsEmail, IsOptional, IsString} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class UpdateUserDto {



  id: number;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
