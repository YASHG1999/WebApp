import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyOtpDto {
  @ApiProperty({
    description: 'phone number of the user',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^[6-9]\d{9}$/)
  phone_number: string;

  @ApiProperty({
    description: 'otp entered by the user',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/\d{6}$/)
  otp: string;
}
