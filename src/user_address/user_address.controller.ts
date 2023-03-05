import {
  Body,
  Controller,
  Post,
  Headers,
  UseFilters,
  Patch,
  Param,
  Get,
  Delete,
} from '@nestjs/common';
import { ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from '../core/http-exception.filter';
// import { Roles } fr om 'src/core/common/custom.decorator';
// import { UserRole } from 'src/user/enum/user.role';
import { CreateAddressDto } from './dto/create_address.dto';
import { UserAddressService } from './user_address.service';
import { UpdateAddressDto } from './dto/update_address.dto';
import { UserAddressEntity } from './user_address.entity';

@Controller('addresses')
@ApiTags('User-Address')
@UseFilters(HttpExceptionFilter)
export class UserAddressController {
  constructor(private userAddressService: UserAddressService) {}

  @ApiBody({ type: UpdateAddressDto })
  @ApiResponse({ type: UserAddressEntity })
  @ApiParam({ name: 'addressId', required: true })
  // @Roles(UserRole.CONSUMER)
  @Patch('/:addressId')
  updateUserAddress(
    @Body() reqBody: UpdateAddressDto,
    @Headers('userId') userId: string,
    @Param() param,
  ): Promise<UserAddressEntity> {
    const address = parseInt(param.addressId);
    return this.userAddressService.updateUserAddress(reqBody, userId, address);
  }

  @ApiBody({ type: CreateAddressDto })
  @ApiResponse({ type: UserAddressEntity })
  // @Roles(UserRole.CONSUMER)
  @Post()
  createUserAddress(
    @Body() reqBody: CreateAddressDto,
    @Headers('userId') userId: string,
  ): Promise<UserAddressEntity> {
    return this.userAddressService.createUserAddress(reqBody, userId);
  }

  @ApiResponse({ type: [UserAddressEntity] })
  // @Roles(UserRole.CONSUMER)
  @Get()
  getUserAddresses(@Headers('userId') userId): Promise<UserAddressEntity[]> {
    return this.userAddressService.getUserAddresses(userId);
  }

  // @Roles(UserRole.CONSUMER)
  @Delete('/:addressId')
  @ApiParam({ name: 'addressId', required: true })
  deleteUserAddresses(
    @Headers('userId') userId,
    @Param() param,
  ): Promise<{ deleted: true }> {
    const address = parseInt(param.addressId);
    return this.userAddressService.deleteUserAddress(userId, address);
  }
}
