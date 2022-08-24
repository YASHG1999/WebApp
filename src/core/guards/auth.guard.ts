import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';
import { ROLES_KEY } from 'src/core/common/custom.decorator';
import { UserRole } from 'src/user/enum/user.role';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private configService: ConfigService,
    private reflector: Reflector,
  ) { }

  canActivate(context: ExecutionContext): boolean {
    const ctx = context.switchToHttp().getRequest();
    if (!ctx.headers.token) {
      return false;
    }
    ctx.user = this.validateToken(ctx.headers.token);

    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    return requiredRoles.some((role) => ctx.user.roles?.includes(role));
  }

  validateToken(auth: string) {
    try {
      const secret = this.configService.get('AT_SECRET');
      return jwt.verify(auth, secret);
    } catch (err) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
  }
}
