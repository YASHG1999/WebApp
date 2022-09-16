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
    @Headers('userId') userId: string,
    @Param() param,
  ): Promise<UserAddress> {
    const address = parseInt(param.addressId);
    return this.userAddressService.updateUserAddress(reqBody, userId, address);
  }

  @ApiBody({ type: CreateAddressDto })
  @ApiResponse({ type: UserAddress })
  @Roles(UserRole.CONSUMER)
  @Post()
  createUserAddress(
    @Body() reqBody: CreateAddressDto,
    @Headers('userId') userId: string,
  ): Promise<UserAddress> {
    return this.userAddressService.createUserAddress(reqBody, userId);
  }

  @ApiResponse({ type: [UserAddress] })
  @Roles(UserRole.CONSUMER)
  @Get()
  getUserAddresses(@Headers('userId') userId): Promise<UserAddress[]> {
    return this.userAddressService.getUserAddresses(userId);
  }

  @Roles(UserRole.CONSUMER)
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