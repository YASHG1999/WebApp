import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AddUserDeviceDto } from './dto/add-userdevice.dto';
import { JwtTokenService } from '../core/jwt-token/jwt-token.service';
import { UserDto } from './dto/user.dto';
import { UpdateUserDeviceDto } from './dto/update-userdevice.dto';
import { UserEntity } from './user.entity';
import { DataSource } from 'typeorm';
import { RefreshTokenEntity } from '../auth/refresh-token.entity';
import { DevicesEntity } from './devices.entity';
import { UserRole } from './enum/user.role';

@Injectable()
export class UserService {
  constructor(
    private jwtTokenService: JwtTokenService,
    private dataSource: DataSource,
  ) {}

  async createUser(dto: CreateUserDto) {
    const userRepository = this.dataSource.getRepository(UserEntity);
    const refreshTokenRepository =
      this.dataSource.getRepository(RefreshTokenEntity);

    const user = (await userRepository.save(dto)) as UserDto;
    const tokens = await this.jwtTokenService.getTokens(
      user.id,
      user.roles,
      UserRole.VISITOR,
    );

    await refreshTokenRepository.save({
      token: tokens.refresh_token,
      user_id: user.id,
    });

    return { user, ...tokens };
  }

  async getUserFromId(id: string): Promise<UserDto> {
    const userRepository = this.dataSource.getRepository(UserEntity);
    const user = await userRepository.findOne({
      where: { id: id },
    });
    return user;
  }

  async getUserFromPhone(phone: string) {
    const userRepository = this.dataSource.getRepository(UserEntity);
    const user = await userRepository.findOne({
      where: { phone_number: phone },
    });
    return user;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const userRepository = this.dataSource.getRepository(UserEntity);
    await userRepository.save({
      id: id,
      name: updateUserDto.name,
    });
    return userRepository.findOne({ where: { id: id } });
  }

  async addUserDevice(id: string, addDeviceDto: AddUserDeviceDto) {
    const devicesRepository = this.dataSource.getRepository(DevicesEntity);

    let device = null;

    if (addDeviceDto.device_id != null) {
      device = devicesRepository.findOne({
        where: { device_id: addDeviceDto.device_id },
      });
    }

    if (device == null) {
      await devicesRepository.save(addDeviceDto);
    } else {
      await devicesRepository.update(
        { device_id: addDeviceDto.device_id },
        addDeviceDto,
      );
    }

    return {
      success: true,
      message: 'Details added successfully',
    };
  }

  async getUserDevices(id: string) {
    const devicesRepository = this.dataSource.getRepository(DevicesEntity);
    const devices = devicesRepository.find({
      where: { user_id: id },
    });
    return devices;
  }

  async updateUserDevice(
    device_id: string,
    updateUserDeviceDto: UpdateUserDeviceDto,
  ) {
    const devicesRepository = this.dataSource.getRepository(DevicesEntity);
    await devicesRepository.update(
      { device_id: device_id },
      updateUserDeviceDto,
    );

    return {
      success: true,
      message: 'Details added successfully',
    };
  }

  //admin
  // async getAllUsers(pageNo: number, limit: number) {
  //   const paginate = createPaginator({ perPage: limit || 10 });
  //   const users = await paginate<user, Prisma.userFindManyArgs>(
  //     this.prisma.user,
  //     {
  //       orderBy: {
  //         id: 'desc',
  //       },
  //     },
  //     { page: pageNo },
  //   );
  //
  //   return users;
  // }
  //
  // async updateUserRoleByAdmin(user: UpdateUserRoleDto): Promise<UserDto> {
  //   const updatedUserRoles = await this.prisma.user.update({
  //     where: { id: user.id },
  //     data: {
  //       ...user,
  //     },
  //   });
  //
  //   return updatedUserRoles;
  // }
}
