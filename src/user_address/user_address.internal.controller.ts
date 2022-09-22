import {
  Body,
  Controller,
  Post,
  Headers,
  UseFilters,
  Param,
  Get,
} from '@nestjs/common';
import { ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from '../core/http-exception.filter';
import { Roles } from 'src/core/common/custom.decorator';
import { UserRole } from 'src/user/enum/user.role';
import { UserAddressService } from './user_address.service';
import { UserAddressEntity } from './user_address.entity';
import { CreateAddressInternalDto } from './dto/create_address.internal.dto';

@Controller('internal/addresses')
@ApiTags('Internal/User-Address')
@UseFilters(HttpExceptionFilter)
export class UserAddressInternalController {
  constructor(private userAddressService: UserAddressService) {}

  @ApiBody({ type: CreateAddressInternalDto })
  @ApiResponse({ type: UserAddressEntity })
  // @Roles(UserRole.INTERNAL)
  @Post()
  createUserAddressInternal(
    @Body() reqBody: CreateAddressInternalDto,
    @Headers('userId') userId: string,
  ): Promise<UserAddressEntity> {
    return this.userAddressService.createUserAddressInternal(reqBody, userId);
  }

  @ApiResponse({ type: UserAddressEntity })
  @ApiParam({ name: 'addressId', required: true })
  @Roles(UserRole.INTERNAL)
  @Get('/:addressId')
  getUserAddressesInternal(@Param() params): Promise<UserAddressEntity> {
    const addressId = parseInt(params.addressId);
    return this.userAddressService.getUserAddressesInternal(addressId);
  }
}
