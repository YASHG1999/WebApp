import { DataSource } from 'typeorm';
import { CreateAddressDto } from './dto/create_address.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserAddressEntity } from './user_address.entity';
import { UpdateAddressDto } from './dto/update_address.dto';

@Injectable()
export class UserAddressService {
  constructor(private dataSource: DataSource) {}

  async createUserAddress(
    addressBody: CreateAddressDto,
    user_id: string,
  ): Promise<UserAddressEntity> {
    const userRepository = this.dataSource.getRepository(UserAddressEntity);
    const body = { ...addressBody, user_id, is_active: true };
    return await userRepository.save(body);
  }

  async updateUserAddress(
    addressBody: UpdateAddressDto,
    user_id: string,
    addressId: number,
  ): Promise<UserAddressEntity> {
    const userRepository = this.dataSource.getRepository(UserAddressEntity);

    const address = await userRepository
      .createQueryBuilder()
      .update({ ...addressBody, is_active: false })
      .where({
        id: addressId,
        user_id: user_id,
        is_active: true,
      })
      .returning('*')
      .execute();

    address.raw.map((el) => {
      delete el.id;
      delete el.updated_at;
      delete el.created_at;
      el.is_active = true;
    });

    if (!address.raw[0]) {
      throw new HttpException(
        { message: 'Address is not found' },
        HttpStatus.NOT_FOUND,
      );
    }

    return await userRepository.save(address.raw[0]);
  }

  async getUserAddresses(user_id: string): Promise<UserAddressEntity[]> {
    const userRepository = this.dataSource.getRepository(UserAddressEntity);
    return await userRepository.findBy({
      user_id: user_id,
      is_active: true,
    });
  }

  async deleteUserAddress(
    user_id: string,
    addressId: number,
  ): Promise<{ deleted: true }> {
    const userRepository = this.dataSource.getRepository(UserAddressEntity);

    const address = await userRepository
      .createQueryBuilder()
      .update({ is_active: false })
      .where({
        id: addressId,
        user_id: user_id,
        is_active: true,
      })
      .returning('*')
      .execute();

    if (!address.raw[0]) {
      throw new HttpException(
        { message: 'Address is not found' },
        HttpStatus.NOT_FOUND,
      );
    }

    return { deleted: true };
  }
}
