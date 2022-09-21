import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class InternalCreateUserDto {
  @ApiProperty({
    description: 'phone number of the user',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^[6-9]\d{9}$/)
  phone_number: string;
}
