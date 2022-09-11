import { DataSource } from 'typeorm';
import { CreateAddressDto } from './dto/create_address.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserAddress } from './user_address.entity';
import { UpdateAddressDto } from './dto/update_address.dto';

@Injectable()
export class UserAddressService {
  constructor(private dataSource: DataSource) { }

  async createUserAddress(addressBody: CreateAddressDto, user_id: string) {
    const userRepository = this.dataSource.getRepository(UserAddress);
    const body = { ...addressBody, user_id };
    return await userRepository.save(body);
  }

  async updateUserAddress(
    addressBody: UpdateAddressDto,
    user_id: string,
    addressId: number,
  ) {
    const userRepository = this.dataSource.getRepository(UserAddress);

    const address = await userRepository
      .createQueryBuilder()
      .update({ ...addressBody })
      .where({
        id: addressId,
        user_id: user_id,
      })
      .returning('*')
      .execute();

    if (!address.raw[0]) {
      throw new HttpException(
        { message: 'Address is not found' },
        HttpStatus.NOT_FOUND,
      );
    }

    return address.raw[0];
  }

  async getUserAddresses(user_id: string) {
    const userRepository = this.dataSource.getRepository(UserAddress);
    return await userRepository.findBy({ user_id: user_id, is_active: true });
  }

  async deleteUserAddress(user_id: string, addressId: number) {
    const userRepository = this.dataSource.getRepository(UserAddress);

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
        { message: 'Address is not found or it is already deleted' },
        HttpStatus.NOT_FOUND,
      );
    }

    return { delete: true };
  }
}
