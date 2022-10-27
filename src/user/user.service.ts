import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AddUserDeviceDto } from './dto/add-userdevice.dto';
import { JwtTokenService } from '../core/jwt-token/jwt-token.service';
import { UserDto } from './dto/user.dto';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { RefreshTokenEntity } from '../auth/refresh-token.entity';
import { DevicesEntity } from './devices.entity';
import { UpdateUserDeviceDto } from './dto/update-userdevice.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { InternalCreateUserDto } from './dto/internal-create-user.dto';
import { UserRole } from './enum/user.role';

@Injectable()
export class UserService {
  constructor(
    private jwtTokenService: JwtTokenService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(RefreshTokenEntity)
    private readonly refreshTokenRepository: Repository<RefreshTokenEntity>,
    @InjectRepository(DevicesEntity)
    private readonly devicesRepository: Repository<DevicesEntity>,
  ) {}

  async createInternalUser(internalCreateUserDto: InternalCreateUserDto) {
    if (!internalCreateUserDto.phone_number)
      return this.userRepository.save({
        roles: [UserRole.VISITOR],
      });

    let user = await this.userRepository.findOne({
      where: { phone_number: internalCreateUserDto.phone_number },
    });

    if (user == null) {
      user = await this.userRepository.save({
        ...internalCreateUserDto,
        roles: [UserRole.VISITOR, UserRole.CONSUMER],
      });
    }

    return user;
  }

  async createUser(dto: CreateUserDto) {
    const user = (await this.userRepository.save(dto)) as UserDto;
    const tokens = await this.jwtTokenService.getTokens(user.id, user.roles);

    await this.refreshTokenRepository.save({
      token: tokens.refresh_token,
      user_id: user.id,
    });

    return { user, ...tokens };
  }

  async getUserFromId(id: string): Promise<UserDto> {
    const user = await this.userRepository.findOne({
      where: { id: id },
    });
    return user;
  }

  async getUserFromPhone(phone: string) {
    const user = await this.userRepository.findOne({
      where: { phone_number: phone, is_deleted: false },
    });
    return user;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    await this.userRepository.save({
      id: id,
      ...updateUserDto,
    });
    return this.userRepository.findOne({ where: { id: id } });
  }

  async addUserDevice(id: string, addDeviceDto: AddUserDeviceDto) {
    let device = null;

    if (addDeviceDto.device_id != null) {
      device = this.devicesRepository.findOne({
        where: { device_id: addDeviceDto.device_id, is_active: true },
      });
    }

    if (device != null) {
      device.is_active = false;
      await this.devicesRepository.save(device);
    }

    // mark as revoked old devices, create new everytime

    await this.devicesRepository.save(addDeviceDto);

    return {
      success: true,
      message: 'Details added successfully',
    };
  }

  async getUserDevices(id: string) {
    return this.devicesRepository.find({
      where: { user_id: id, is_active: true },
    });
  }

  async updateUserDevice(
    userId: string,
    device_id: string,
    updateUserDeviceDto: UpdateUserDeviceDto,
  ) {
    await this.devicesRepository.update(
      { user_id: userId, device_id: device_id },
      updateUserDeviceDto,
    );
    // would have to add find check

    return {
      success: true,
      message: 'Details added successfully',
    };
  }

  async deleteAccount(userId) {
    await this.refreshTokenRepository.delete({
      user_id: userId,
    });

    await this.userRepository.update({ id: userId }, { is_deleted: true });

    return {
      success: true,
      message: 'Your Account is deleted successfully',
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
