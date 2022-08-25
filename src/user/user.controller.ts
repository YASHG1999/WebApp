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
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AddUserDeviceDto } from './dto/add-userdevice.dto';
import { ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '../core/guards/auth.guard';
import { UserDto } from './dto/user.dto';
import { UpdateUserDeviceDto } from './dto/update-userdevice.dto';
import { HttpExceptionFilter } from '../core/http-exception.filter';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';

@Controller('user')
@UseFilters(HttpExceptionFilter)
export class UserController {
  constructor(private userService: UserService) {}

  //admin
  @Get('/admin')
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Patch('/admin')
  updateUserRoleByAdmin(@Body() dto: UpdateUserRoleDto) {
    return this.userService.updateUserRoleByAdmin(dto);
  }

  // user
  @Post()
  @ApiBody({ type: CreateUserDto })
  createUser(@Body() dto: CreateUserDto) {
    return this.userService.createUser(dto);
  }

  // All Below this are authenticated APIs
  @Get(':id')
  @UseGuards(AuthGuard)
  async getUser(@Param('id') id: string): Promise<UserDto> {
    const user = await this.userService.getUserFromId(id);
    if (user == null) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiBody({ type: UpdateUserDto })
  updateUser(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.userService.updateUser(id, dto);
  }

  @Post(':id/device-details')
  @UseGuards(AuthGuard)
  @ApiBody({ type: AddUserDeviceDto })
  addUserDevice(@Param('id') id: string, @Body() dto: AddUserDeviceDto) {
    return this.userService.addUserDevice(id, dto);
  }

  @Get(':id/device-details')
  @UseGuards(AuthGuard)
  getUserDevices(@Param('id') id: string) {
    return this.userService.getUserDevices(id);
  }

  @Patch(':id/device-details/:device_id')
  @UseGuards(AuthGuard)
  updateUserDevice(
    @Param('id') id: string,
    @Param('device_id') device_id: string,
    @Body() dto: UpdateUserDeviceDto,
  ) {
    return this.userService.updateUserDevice(device_id, dto);
  }
}
