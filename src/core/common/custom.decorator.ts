import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UserRole } from '../../user/enum/user.role';
import { AuthGuard } from '../guards/auth.guard';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);

export function Auth() {
  return applyDecorators(UseGuards(AuthGuard), ApiBearerAuth('JWT-auth'));
}
