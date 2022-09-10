import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({
    description: 'name of the user',
  })
  @IsString()
  @IsOptional()
  name?: string;
}
