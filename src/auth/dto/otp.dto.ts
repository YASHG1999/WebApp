import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OtpDto {
  @ApiProperty({
    description: 'country code of the phone number',
  })
  @IsNotEmpty()
  @IsString()
  country_code: string;

  @ApiProperty({
    description: 'phone number of the user',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^[6-9]\d{9}$/gi)
  phone_number: string;
}
