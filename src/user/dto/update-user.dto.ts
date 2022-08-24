import { IsEmail, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({
    description: 'email id of the user',
  })
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'url for user avatar',
  })
  @IsString()
  @IsOptional()
  avatar_url?: string;

  @ApiProperty({
    description: 'name of the user',
  })
  @IsString()
  @IsOptional()
  name?: string;
}
