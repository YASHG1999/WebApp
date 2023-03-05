import { DataSource, In, Repository } from 'typeorm';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './dto/create-users.dto';
import { UpdateUserDto } from './dto/update-users.dto';
import axios from 'axios';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from './entities/users.entity';
import { id } from 'date-fns/locale';
import {CategoryEntity} from "../category/entity/category.entity";




  
@Injectable()
export class UsersService {
  constructor(private dataSource: DataSource,

    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,


  ) {}


  async createUser(
    userBody: CreateUserDto,
    updatedBy: string,
  ){
    let user: UsersEntity = null;
    console.log(userBody);

      // @ts-ignore     uses????
    user = await this.usersRepository.save({
        ...userBody,

      });
      return user;

  }

  async updateUser(
    UserBody: UpdateUserDto,
    UserId: number,
    updatedBy: string,
  ){
    let User = null;
    console.log(UserBody);
    let existingUser:UsersEntity = null;


      existingUser = await this.usersRepository.findOneBy({ id: UserId });
      existingUser.phone_no = UserBody.phone_number;
     return existingUser;

    }

  async getAllUsers(){
  const userRepository = this.dataSource.getRepository(UsersEntity);
  return await userRepository.find({where:{is_active:true}});
}

  // (filters: any = {}) {
  //   const filter: {
  //     id?: number;
  //   } = {};
  //   if (filters?.id) filter.id = filters.id;
  //   };
  

    
   // for Delete User
  async deleteUser(id: number) {
   
   const a = await this.usersRepository.findOneBy({id:id});
    a.is_active=false;
    await this.usersRepository.save(a);
    return a;
  }
}







