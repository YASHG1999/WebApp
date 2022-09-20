import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../../auth/types';
import { Config } from '../../config/configuration';

@Injectable()
export class JwtTokenService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService<Config, true>,
  ) {}

  async getAccessToken(userId, userRole) {
    const jwtPayload: JwtPayload = {
      iss: this.configService.get<string>('iss'),
      userId: userId,
      roles: userRole,
    };

    const accessToken = await this.jwtService.signAsync(jwtPayload, {
      secret: this.configService.get<string>('at_secret'),
      expiresIn: this.configService.get<string>('at_expiry'),
    });

    return accessToken;
  }

  async getRefreshToken(userId, userRole) {
    const jwtPayload: JwtPayload = {
      iss: this.configService.get<string>('iss'),
      userId: userId,
      roles: userRole,
    };

    const refreshToken = await this.jwtService.signAsync(jwtPayload, {
      secret: this.configService.get<string>('rt_expiry'),
      expiresIn: this.configService.get<string>('rt_expiry'),
    });

    return refreshToken;
  }

  async getTokens(userId, userRole) {
    return {
      access_token: await this.getAccessToken(userId, userRole),
      refresh_token: await this.getRefreshToken(userId, userRole),
    };
  }

  async decodeJwt(token: string): Promise<JwtPayload> {
    const decodedJwtAccessToken: JwtPayload = this.jwtService.decode(
      token,
    ) as JwtPayload;

    return decodedJwtAccessToken;
  }

  async verifyJwt(token: string) {
    return await this.jwtService.verify(token, {
      secret: this.configService.get<string>('rt_secret'),
    });
  }
}
