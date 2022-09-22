import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateAddressDto } from './create_address.dto';

export class CreateAddressInternalDto extends CreateAddressDto {
  @ApiProperty()
  @IsString()
  user_id: string;
}
