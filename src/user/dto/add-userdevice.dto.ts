import { ApiProperty } from '@nestjs/swagger';

export class AddUserDeviceDto {
  @ApiProperty({
    description: 'id of the user',
  })
  user_id: string;

  @ApiProperty({
    description: 'device id of the device logged in from',
  })
  device_id: string;

  @ApiProperty({
    description: 'mac address of the device logged in from',
  })
  mac_address?: string;

  @ApiProperty({
    description: 'manufacturer of the device logged in from',
  })
  manufacturer?: string;

  @ApiProperty({
    description: 'model of the device logged in from',
  })
  model?: string;

  @ApiProperty({
    description: 'operating system of the device logged in from',
  })
  os?: string;

  @ApiProperty({
    description: 'version of the app installed',
  })
  app_version?: string;

  @ApiProperty({
    description: 'notification token for the linked device',
  })
  notification_token: string;
}
