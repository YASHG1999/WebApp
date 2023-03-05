import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, UseFilters ,Headers} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-users.dto';
import { UpdateUserDto } from "./dto/update-users.dto";
import { UsersEntity } from './entities/users.entity';
import { ProductsRole } from './enum/products.role';
import { ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
//
// import { Roles, UserRole } from 'src/core/common/custom.decorator';



@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

//doubt on --readonly-- does it effect update api??
  @ApiBody({ type: CreateUserDto })
  @Post()
  // @Roles(UserRole.ADMIN)
  createUser(
    @Body() reqBody: CreateUserDto,
    @Headers('userId') createdBy: string,
  ){
    return this.usersService.createUser(reqBody, createdBy);
  }

  @ApiBody({ type: UpdateUserDto })
  @ApiParam({ name: 'userId', required: true })
  // @Roles(UserRole.ADMIN)
  @Patch('/:userId')
  updateUser(
    @Body() reqBody: UpdateUserDto,
    @Param() param,
    @Headers('userId') createdBy: string,
  ) {
    const userId = parseInt(param.userId);
    return this.usersService.updateUser(reqBody, userId, createdBy);
  }

  
  @Get()
  getAllUsers(){
    return this.usersService.getAllUsers();
  }

  // For Delete Product
  
  @Delete('/:userId')
  @ApiParam({ name: 'userId', required: true })
  deleteProduct(@Param() param) {
    const userId = parseInt(param.userId);
    return this.usersService.deleteUser(userId);
  }

}



