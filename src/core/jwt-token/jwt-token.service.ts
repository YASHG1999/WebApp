import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../../auth/types';

@Injectable()
export class JwtTokenService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async getAccessToken(userId, userRole, defaultRole) {
    const jwtPayload: JwtPayload = {
      iss: this.configService.get<string>('ISS'),
      iat: Date.now(),
      userId: userId,
      roles: userRole,
      defaultRole: defaultRole,
    };

    const accessToken = await this.jwtService.signAsync(jwtPayload, {
      secret: this.configService.get<string>('AT_SECRET'),
      expiresIn: this.configService.get<string>('AT_EXPIRY'),
    });

    return accessToken;
  }

  async getRefreshToken(userId, userRole, defaultRole) {
    const jwtPayload: JwtPayload = {
      iss: this.configService.get<string>('ISS'),
      iat: Date.now(),
      userId: userId,
      roles: userRole,
      defaultRole: defaultRole,
    };

    const refreshToken = await this.jwtService.signAsync(jwtPayload, {
      secret: this.configService.get<string>('RT_SECRET'),
      expiresIn: this.configService.get<string>('RT_EXPIRY'),
    });

    return refreshToken;
  }

  async getTokens(userId, userRole, defaultRole) {
    return {
      access_token: await this.getAccessToken(userId, userRole, defaultRole),
      refresh_token: await this.getRefreshToken(userId, userRole, defaultRole),
    };
  }

  async decodeJwt(token: string): Promise<JwtPayload> {
    const decodedJwtAccessToken: JwtPayload = this.jwtService.decode(
      token,
    ) as JwtPayload;

    return decodedJwtAccessToken;
  }
}
