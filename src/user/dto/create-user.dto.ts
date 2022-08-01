import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  phone_number: string;

  @IsString()
  @IsOptional()
  name?: string;
}
