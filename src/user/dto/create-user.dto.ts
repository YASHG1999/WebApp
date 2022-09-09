import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsUUID } from 'class-validator';
import { IsNull } from 'typeorm';

export class CreateUserDto {
  @IsOptional()
  id?: string;
}
