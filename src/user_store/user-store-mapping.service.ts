import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { UserStoreMappingEntity } from './user-store-mapping.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserStoreMappingService {
  constructor(
    @InjectRepository(UserStoreMappingEntity)
    private readonly userStoreMappingRepository: Repository<UserStoreMappingEntity>,
  ) {}

  async createUserStoreMapping(
    user_id: string,
    store_id: string,
  ): Promise<UserStoreMappingEntity> {
    return await this.userStoreMappingRepository.save({
      user_id: user_id,
      store_id: store_id,
    });
  }
}
