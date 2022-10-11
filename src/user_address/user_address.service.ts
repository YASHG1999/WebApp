import { DataSource } from 'typeorm';
import { CreateAddressDto } from './dto/create_address.dto';
import { CreateAddressInternalDto } from './dto/create_address.internal.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserAddressEntity } from './user_address.entity';
import { UpdateAddressDto } from './dto/update_address.dto';
import { AddressType } from './enum/address.enum';

@Injectable()
export class UserAddressService {
  constructor(private dataSource: DataSource) {}

  async createUserAddress(
    addressBody: CreateAddressDto,
    user_id: string,
  ): Promise<UserAddressEntity> {
    const userRepository = this.dataSource.getRepository(UserAddressEntity);
    const body = {
      ...addressBody,
      user_id,
      is_active: true,
      updated_by: user_id,
    };
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
      .update({ is_active: false })
      .where({
        id: addressId,
        user_id: user_id,
        is_active: true,
      })
      .returning(
        'user_id, name, type, is_default, address_line_1, address_line_2, landmark, city, state, pincode, contact_number, lat, long',
      )
      .execute();

    if (!address.raw[0]) {
      throw new HttpException(
        { message: 'Address is not found' },
        HttpStatus.NOT_FOUND,
      );
    }

    const updatedAddress = Object.assign(address.raw[0], addressBody);
    delete updatedAddress.id;

    return await userRepository.save({
      ...updatedAddress,
      updated_by: user_id,
    });
  }

  async getUserAddresses(user_id: string): Promise<UserAddressEntity[]> {
    const userRepository = this.dataSource.getRepository(UserAddressEntity);
    return await userRepository.findBy({
      user_id: user_id,
      is_active: true,
    });
  }

  async getUserAddressesByUserIdInternal(
    user_id: string,
  ): Promise<UserAddressEntity[]> {
    const userRepository = this.dataSource.getRepository(UserAddressEntity);
    return await userRepository.findBy({
      user_id: user_id,
      //is_active: true,
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

  async createUserAddressInternal(
    addressBody: CreateAddressInternalDto,
    user_id: string,
  ): Promise<UserAddressEntity> {
    const userRepository = this.dataSource.getRepository(UserAddressEntity);
    const body = {
      ...addressBody,
      is_active: false,
      type: AddressType.Other,
      updated_by: user_id,
    };
    return await userRepository.save(body);
  }

  async getUserAddressesInternal(
    addressId: number,
  ): Promise<UserAddressEntity> {
    const userRepository = this.dataSource.getRepository(UserAddressEntity);

    const address = await userRepository
      .createQueryBuilder()
      .where({
        id: addressId,
      })
      .getOne();

    if (!address) {
      throw new HttpException(
        { message: 'Address is not found' },
        HttpStatus.NOT_FOUND,
      );
    }

    return address;
  }

  async getUserAddressesbyRefInternal(
    refId: number,
  ): Promise<UserAddressEntity> {
    const userRepository = this.dataSource.getRepository(UserAddressEntity);

    const address = await userRepository
      .createQueryBuilder()
      .where({
        lithos_ref: refId,
      })
      .getOne();

    if (!address) {
      throw new HttpException(
        { message: 'Ref not found' },
        HttpStatus.NOT_FOUND,
      );
    }

    return address;
  }
}
