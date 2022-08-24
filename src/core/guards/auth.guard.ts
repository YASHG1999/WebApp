import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const ctx = context.switchToHttp().getRequest();
    if (!ctx.headers.token) {
      return false;
    }
    ctx.user = this.validateToken(ctx.headers.token);
    return true;
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
