import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDeviceDto {
  @ApiProperty({
    description: 'notification token for the linked device',
  })
  notification_token: string;
}
