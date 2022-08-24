import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LogoutDto {
  @ApiProperty({
    description: 'device id of the device logged in from',
  })
  @IsNotEmpty()
  @IsString()
  device_id: string;

  @ApiProperty({
    description: 'refresh token of the device logged in from',
  })
  @IsNotEmpty()
  @IsString()
  refresh_token: string;
}
