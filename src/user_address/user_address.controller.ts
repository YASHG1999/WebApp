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
import { Roles } from 'src/core/common/custom.decorator';
import { UserRole } from 'src/user/enum/user.role';
import { CreateAddressDto } from './dto/create_address.dto';
import { UserAddressService } from './user_address.service';
import { UpdateAddressDto } from './dto/update_address.dto';
import { UserAddress } from './user_address.entity';

@Controller('addresses')
@ApiTags('User-Address')
@UseFilters(HttpExceptionFilter)
export class UserAddressController {
  constructor(private userAddressService: UserAddressService) {}

  @ApiBody({ type: UpdateAddressDto })
  @ApiResponse({ type: UserAddress })
  @ApiParam({ name: 'addressId', required: true })
  @Roles(UserRole.CONSUMER)
  @Patch('/:addressId')
  updateUserAddress(
    @Body() reqBody: UpdateAddressDto,
    @Headers() user,
    @Param() param,
  ): Promise<UserAddress> {
    const user_id = user.userid;
    const address = parseInt(param.addressId);
    return this.userAddressService.updateUserAddress(reqBody, user_id, address);
  }

  @ApiBody({ type: CreateAddressDto })
  @ApiResponse({ type: UserAddress })
  @Roles(UserRole.CONSUMER)
  @Post()
  createUserAddress(
    @Body() reqBody: CreateAddressDto,
    @Headers() user,
  ): Promise<UserAddress> {
    const user_id = user.userid;
    return this.userAddressService.createUserAddress(reqBody, user_id);
  }

  @ApiResponse({ type: [UserAddress] })
  @Roles(UserRole.CONSUMER)
  @Get()
  getUserAddresses(@Headers() user): Promise<UserAddress[]> {
    const user_id = user.userid;
    return this.userAddressService.getUserAddresses(user_id);
  }

  @Roles(UserRole.CONSUMER)
  @Delete('/:addressId')
  @ApiParam({ name: 'addressId', required: true })
  deleteUserAddresses(
    @Headers() user,
    @Param() param,
  ): Promise<{ deleted: true }> {
    const user_id = user.userid;
    const address = parseInt(param.addressId);
    return this.userAddressService.deleteUserAddress(user_id, address);
  }
}
