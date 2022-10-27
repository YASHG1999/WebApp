import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseFilters,
  Headers,
  Delete,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AddUserDeviceDto } from './dto/add-userdevice.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { UserDto } from './dto/user.dto';
import { HttpExceptionFilter } from '../core/http-exception.filter';
import { Roles } from 'src/core/common/custom.decorator';
import { UserRole } from './enum/user.role';
import { UpdateUserDeviceDto } from './dto/update-userdevice.dto';

@Controller('user')
@ApiTags('User')
@UseFilters(HttpExceptionFilter)
export class UserController {
  constructor(private userService: UserService) {}

  //admin
  // @Get('/admin')
  // @Roles(UserRole.ADMIN)
  // getAllUsers(@Query() queryParams: { pageNo: number; perPage: number }) {
  //   return this.userService.getAllUsers(
  //     queryParams.pageNo,
  //     queryParams.perPage,
  //   );
  // }

  // @Patch('/admin')
  // @Roles(UserRole.ADMIN)
  // updateUserRoleByAdmin(@Body() dto: UpdateUserRoleDto) {
  //   return this.userService.updateUserRoleByAdmin(dto);
  // }

  // user
  @Post('/create')
  @ApiBody({ type: CreateUserDto })
  createUser(@Body() dto: CreateUserDto) {
    return this.userService.createUser(dto);
  }

  // All Below this are authenticated APIs
  @Get(':id')
  @Roles(UserRole.CONSUMER)
  async getUser(@Param('id') id: string): Promise<UserDto> {
    const user = await this.userService.getUserFromId(id);
    if (user == null) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  @Patch(':id')
  @Roles(UserRole.CONSUMER)
  @ApiBody({ type: UpdateUserDto })
  updateUser(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.userService.updateUser(id, dto);
  }

  @Post(':id/device-details')
  @Roles(UserRole.CONSUMER)
  @ApiBody({ type: AddUserDeviceDto })
  addUserDevice(@Param('id') id: string, @Body() dto: AddUserDeviceDto) {
    return this.userService.addUserDevice(id, dto);
  }

  @Get(':id/device-details')
  @Roles(UserRole.CONSUMER)
  getUserDevices(@Param('id') id: string) {
    return this.userService.getUserDevices(id);
  }

  @Patch(':id/device-details/:device_id')
  @Roles(UserRole.CONSUMER)
  updateUserDevice(
    @Param('id') userId: string,
    @Param('device_id') device_id: string,
    @Body() dto: UpdateUserDeviceDto,
  ) {
    return this.userService.updateUserDevice(userId, device_id, dto);
  }

  @Roles(UserRole.CONSUMER)
  @Delete('delete')
  deleteAccount(@Headers('userId') userId) {
    const a = this.userService.deleteAccount(userId);
    return a;
  }
}
