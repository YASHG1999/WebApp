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
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from '../core/http-exception.filter';
import { Roles } from 'src/core/common/custom.decorator';
import { UserRole } from 'src/user/enum/user.role';
import { CreateAddressDto } from './dto/create_address.dto';
import { UserAddressService } from './user_address.service';
import { UpdateAddressDto } from './dto/update_address.dto';

@Controller('address')
@ApiTags('User-Address')
@UseFilters(HttpExceptionFilter)
export class UserAddressController {
  constructor(private userAddressService: UserAddressService) {}
  @ApiBody({ type: UpdateAddressDto })
  @Roles(UserRole.CONSUMER)
  @Patch('/:addressId')
  updateUserAddress(
    @Body() reqBody: UpdateAddressDto,
    @Headers() user,
    @Param() param,
  ) {
    const user_id = user.user_id;
    const address = parseInt(param.addressId);
    return this.userAddressService.updateUserAddress(reqBody, user_id, address);
  }

  @ApiBody({ type: CreateAddressDto })
  @Roles(UserRole.CONSUMER)
  @Post()
  createUserAddress(@Body() reqBody: CreateAddressDto, @Headers() user) {
    const user_id = user.user_id;
    return this.userAddressService.createUserAddress(reqBody, user_id);
  }

  @Roles(UserRole.CONSUMER)
  @Get()
  getUserAddresses(@Headers() user) {
    const user_id = user.user_id;
    return this.userAddressService.getUserAddresses(user_id);
  }

  @Roles(UserRole.CONSUMER)
  @Delete('/:addressId')
  deleteUserAddresses(@Headers() user, @Param() param) {
    const user_id = user.user_id;
    const address = parseInt(param.addressId);
    return this.userAddressService.deleteUserAddress(user_id, address);
  }
}
