import { Param, Body, Controller, Post, Get, UseFilters } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from '../core/http-exception.filter';
import { Roles } from 'src/core/common/custom.decorator';
import { UserRole } from './enum/user.role';
import { InternalCreateUserDto } from './dto/internal-create-user.dto';

@Controller('internal/user')
@ApiTags('User - Internal')
@Roles(UserRole.INTERNAL, UserRole.ADMIN)
@UseFilters(HttpExceptionFilter)
export class InternalUserController {
  constructor(private userService: UserService) {}

  @Post()
  @ApiBody({ type: InternalCreateUserDto })
  internalCreateUser(@Body() internalCreateUserDto: InternalCreateUserDto) {
    return this.userService.createInternalUser(internalCreateUserDto);
  }

  @Get(':id')
  getUser(@Param('id') id: string) {
    return this.userService.getUserFromId(id);
  }
}
