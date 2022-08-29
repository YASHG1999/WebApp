import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AddUserDeviceDto } from './dto/add-userdevice.dto';
import { JwtTokenService } from '../core/jwt-token/jwt-token.service';
import { UserDto } from './dto/user.dto';
import { UpdateUserDeviceDto } from './dto/update-userdevice.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { user, Prisma } from '@prisma/client';
import { createPaginator } from 'src/core/common/paginate.service';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private jwtTokenService: JwtTokenService,
  ) {}

  async createUser(dto: CreateUserDto) {
    const user = await this.prisma.user.create({ data: dto });
    const tokens = await this.jwtTokenService.getTokens(user.id, user.roles);

    this.prisma.refresh_token.create({
      data: {
        token: tokens.refresh_token,
        user_id: user.id,
      },
    });

    return { user, ...tokens };
  }

  async getUserFromId(id: string): Promise<UserDto> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    return user;
  }

  async getUserFromPhone(phone: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        phone_number: phone,
      },
    });
    return user;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.update({
      where: {
        id: id,
      },
      data: updateUserDto,
    });
    return user;
  }

  async addUserDevice(id: string, addDeviceDto: AddUserDeviceDto) {
    let device = null;

    if (addDeviceDto.device_id != null) {
      device = this.prisma.devices.findUnique({
        where: {
          device_id: addDeviceDto.device_id,
        },
      });
    }

    if (device == null) {
      await this.prisma.devices.create({ data: addDeviceDto });
    } else {
      await this.prisma.devices.update({
        where: {
          device_id: addDeviceDto.device_id,
        },
        data: addDeviceDto,
      });
    }

    return {
      success: true,
      message: 'Details added successfully',
    };
  }

  async getUserDevices(id: string) {
    const devices = await this.prisma.devices.findMany({
      where: { user_id: id },
    });
    return devices;
  }

  async updateUserDevice(
    device_id: string,
    updateUserDeviceDto: UpdateUserDeviceDto,
  ) {
    await this.prisma.devices.update({
      where: { device_id: device_id },
      data: updateUserDeviceDto,
    });

    return {
      success: true,
      message: 'Details added successfully',
    };
  }

  //admin
  async getAllUsers(pageNo: number, limit: number) {
    const paginate = createPaginator({ perPage: limit || 10 });
    const users = await paginate<user, Prisma.userFindManyArgs>(
      this.prisma.user,
      {
        // where: {
        //   name: {
        //     contains: 'Alice',
        //   },
        // },
        orderBy: {
          id: 'desc',
        },
      },
      { page: pageNo },
    );

    return users;
  }

  async updateUserRoleByAdmin(user: UpdateUserRoleDto): Promise<UserDto> {
    const updatedUserRoles = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        ...user,
      },
    });

    return updatedUserRoles;
  }
}
