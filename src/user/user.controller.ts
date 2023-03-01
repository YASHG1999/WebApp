// import {
//   Body,
//   Controller,
//   Get,
//   HttpException,
//   HttpStatus,
//   Param,
//   Patch,
//   Post,
//   UseFilters,
//   Headers,
//   Delete, Put,
// } from '@nestjs/common';
// import { CreateUserDto } from './dto/create-user.dto';
// import { UserService } from './user.service';
// import { UpdateUserDto } from './dto/update-user.dto';
// import { ApiBody, ApiTags } from '@nestjs/swagger';
// import { UserDto } from './dto/user.dto';
// import { HttpExceptionFilter } from '../core/http-exception.filter';
// import { Roles } from 'src/core/common/custom.decorator';
// import { UserRole } from './enum/user.role';
// import {UserEntity} from "./user.entity";
//
//
//
// @Controller('users')
// export class UserController {
//   constructor(private readonly userService: UserService) {
//     console.log('UserController constructor');
//   }
//
//   @Get()
//   async getUsers(){
//     console.log('UserController getUsers');
//     const users = await this.userService.findAll();
//     return {
//       statusCode: HttpStatus.OK,
//       message: 'Users fetched successfully',
//       data: users,
//     };
//   }
//
//   @Get('/:id')
//   async getUser(@Param('id') id: number) {
//     console.log('UserController getUser');
//     console.log(id);
//
//     const user = await this.userService.findOne(id);
//
//     console.log(user);
//
//     if (!user) {
//       return {
//         statusCode: HttpStatus.NOT_FOUND,
//         message: 'User not found',
//       };
//     }
//
//     return {
//       statusCode: HttpStatus.OK,
//       message: 'User fetched successfully',
//       data: user,
//     };
//   }
//
//   @Post('/create')
//   //async createUser(@Body() user: User): Promise<ResponseInterface> {
//   async createUser(@Body() data: UserDto) {
//     console.log('UserController createUser');
//
//     console.log(data);
//     const [alreadyExists] = await Promise.all([this.userService.checkUserExists(data.email)]);
//     if (alreadyExists) {
//       return {
//         statusCode: HttpStatus.CONFLICT,
//         message: `User already exists with this email ${data.email}`,
//       };
//     }
//
//     const newUser = await this.userService.create(data);
//
//     console.log(newUser);
//
//     return {
//       statusCode: HttpStatus.CREATED,
//       message: 'User created successfully',
//       data: newUser,
//     };
//   }
//
//   @Put('update/:id')
//   async updateUser(
//       @Param('id') id: number,
//       @Body() user: UpdateUserDto,
//   ) {
//     console.log('UserController updateUser');
//     console.log(id);
//     console.log(user);
//     if (user.email) {
//       console.log('email found!');
//       const alreadyExists = await this.userService.checkUserEmailExistsUpdate(
//           id,
//           user.email,
//       );
//       console.log(alreadyExists);
//       if (alreadyExists) {
//         return {
//           statusCode: HttpStatus.CONFLICT,
//           message: `User already exists with this email ${user.email}`,
//         };
//       }
//     }
//
//     const updatedUser = await this.userService.update(id, user);
//     console.log(updatedUser);
//
//     if (!updatedUser) {
//       return {
//         statusCode: HttpStatus.NOT_FOUND,
//         message: 'User not found',
//       };
//     }
//     return {
//       statusCode: HttpStatus.OK,
//       message: 'User updated successfully',
//       data: updatedUser,
//     };
//   }
//
//   @Delete('delete/:id')
//   async deleteUser(@Param('id') id: number) {
//     console.log('UserController deleteUser');
//     console.log(id);
//
//     const isDeleted = await this.userService.delete(id);
//     if (!isDeleted) {
//       return {
//         statusCode: HttpStatus.NOT_FOUND,
//         message: 'User Not Found',
//       };
//     }
//
//     return {
//       statusCode: HttpStatus.NO_CONTENT,
//       message: 'User Deleted successfully',
//     };
//   }
// }
//
//
//
//
//
//
//
//
//
// //
// // @Controller('user')
// // @ApiTags('User')
// // @UseFilters(HttpExceptionFilter)
// // export class UserController {
// //   constructor(private userService: UserService) {}
// //
// //   // user
// //   @Post('/create')
// //   @ApiBody({ type: CreateUserDto })
// //   createUser(@Body() dto: CreateUserDto) {
// //     return this.userService.createUser(dto);
// //   }
// //
// //   // All Below this are authenticated APIs
// //   @Get(':id')
// //   @Roles(UserRole.CONSUMER)
// //   async getUser(@Param('id') id: number): Promise<UserEntity> {
// //     const user = await this.userService.getUserFromId(id);
// //     if (user == null) {
// //       throw new HttpException('user not found', HttpStatus.NOT_FOUND);
// //     }
// //     return user;
// //   }
// //
// //   @Patch(':id')
// //   @Roles(UserRole.CONSUMER)
// //   @ApiBody({ type: UpdateUserDto })
// //   updateUser(@Param('id') id: string, @Body() dto: UpdateUserDto) {
// //     return this.userService.updateUser(id, dto);
// //   }
// //
// //   @Roles(UserRole.CONSUMER)
// //   @Delete('delete')
// //   deleteAccount(@Headers('userId') userId) {
// //     const a = this.userService.deleteAccount(userId);
// //     return a;
// //   }
// // }
