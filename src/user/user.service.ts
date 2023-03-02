import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { UserEntity } from './user.entity';
import { Not,Repository } from 'typeorm';
import { DevicesEntity } from './devices.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRole } from './enum/user.role';


// class JwtTokenService {
// }

@Injectable()
export class UserService {
  constructor(

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    @InjectRepository(DevicesEntity)
    private readonly devicesRepository: Repository<DevicesEntity>,
    // private jwtTokenService: JwtTokenService,


  ) {}

  async findAll(): Promise<UserEntity[]> {
    try {
      return await this.userRepository.find();
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: number): Promise<UserEntity> {
    try {
      return await this.userRepository.findOne(id);
    } catch (error) {
      throw error;
    }
  }

  async createUser(user: CreateUserDto): Promise<UserEntity> {
    try {
      return await this.userRepository.save(user);
    } catch (error) {
      throw error;
    }
  }

  async update(id: number, user: UpdateUserDto): Promise<UserEntity> {
    try {
      user.id = id;
      await this.userRepository.update(id, user);
      return await this.userRepository.findOne(user.id);
    } catch (error) {
      throw error;
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const result = await this.userRepository.delete(id);
      console.log(result);
      return result.affected === 0 ? false : true;
    } catch (error) {
      throw error;
    }
  }

  async findByEmail(email: string): Promise<UserEntity> {
    try {
      return await this.userRepository.findOne({ where: { email } });
    } catch (error) {
      throw error;
    }
  }

  async checkUserExists(email: string): Promise<boolean> {
    try {
      const user = await this.userRepository.findOne({ where: { email } });
      return user ? true : false;
    } catch (error) {
      throw error;
    }
  }

  async checkUserEmailExistsUpdate(
      id: number,
      email: string,
  ): Promise<boolean> {
    try {
      // const query = await this.userRepository.createQueryBuilder('user');
      // query.where('user.id != :id', { id });
      // query.andWhere('user.email = :email', { email });
      // console.log(query.getQuery());
      // const user = await query.getOne();
      // return user ? true : false;
      console.log('id inside service', id);
      console.log('email inside service', email);

      const user = await this.userRepository.findOne({
        where: { email: email, id: Not(id) },
      });
      return user ? true : false;
    } catch (error) {
      throw error;
    }
  }
}
// ------------------------------------------------------------

  //
  //
  // async createUser(dto: CreateUserDto) {
  //   const user = (await this.userRepository.save(dto)) as unknown as UserDto;
  //
  //
  //   await this.createUser(dto).save({
  //     user_id: user.id,
  //   });
  //
  //   return { user };
  // }
  //
  // async getUserFromId(id: number): Promise<UserEntity> {
  //   const user = await this.userRepository.findOne({
  //     where: { id: id },
  //   });
  //   return user;
  // }
  //
  // async getUserFromPhone(phone: string) {
  //   const user = await this.userRepository.findOne({
  //     where: { phone_number: phone, is_deleted: false },
  //   });
  //   return user;
  // }
  //
  // async updateUser(id: number, updateUserDto: UpdateUserDto) {
  //   await this.userRepository.save({
  //     id: id,
  //     ...updateUserDto,
  //   });
  //   return this.userRepository.findOne({ where: { id: id } });
  // }
  //
  //
  //
  //
  //
  // async deleteAccount(userId) {
  //   await this.refreshTokenRepository.delete({
  //     user_id: userId,
  //   });
  //
  //   await this.userRepository.update({ id: userId }, { is_deleted: true });
  //
  //   return {
  //     success: true,
  //     message: 'Your Account is deleted successfully',
  //   };
  // }

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

// }
