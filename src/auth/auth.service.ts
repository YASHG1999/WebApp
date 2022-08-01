import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { JwtPayload, Tokens } from './types';
import { UserService } from '../user/user.service';
import { OtpDto } from './dto/otp.dto';
import { generate } from 'otp-generator';

import { UserRole } from '../user/enum/user.role';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UpdateUserDto } from '../user/dto/update-user.dto';
import { VerifyOtpDto } from './dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
    private userService: UserService,
  ) {}

  async otp(otpDto: OtpDto) {
    //mobile number validation -- to be added
    let user = await this.userService.getUserFromPhone(otpDto.phone);

    if (user == null) {
      const createUserDto: CreateUserDto = { phone_number: otpDto.phone };
      user = await this.userService.createUser(createUserDto);
    }

    const otpCreated: number = generate(6, {
      digits: true,
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    this.prisma.otp_tokens.create({
      data: { otp: Number(otpCreated), phone_number: user.phone_number },
    });

    return {
      success: true,
      message: 'otp sent successfully',
    };
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    const user = await this.userService.getUserFromPhone(verifyOtpDto.phone);

    const otpToken = await this.prisma.otp_tokens.findFirst({
      where: {
        phone_number: verifyOtpDto.phone,
      },
    });

    if (verifyOtpDto.otp != otpToken.otp) {
      return {
        message: 'Wrong otp',
      };
    }

    const tokens = await this.getTokens(user.id, user.roles);

    this.prisma.refresh_token.create({
      data: {
        token: tokens.refresh_token,
        user_id: user.id,
      },
    });

    return { ...tokens, user };
  }

  toTimestamp(strDate): number {
    const datum = Date.parse(strDate);
    return datum / 1000;
  }

  async useRefreshToken(refreshTokenDto: RefreshTokenDto) {
    const otpToken = await this.prisma.refresh_token.findFirst({
      where: {
        token: refreshTokenDto.refreshToken,
      },
    });

    const user = await this.prisma.user.findUnique({
      where: {
        id: otpToken.user_id,
      },
    });

    const at = await this.getAccessToken(user.id, user.roles);

    return {
      access_token: at,
      refresh_token: refreshTokenDto.refreshToken,
      user: user,
    };
  }

  async getAccessToken(userId, userRole) {
    const jwtPayload: JwtPayload = {
      iss: 'url',
      iat: this.toTimestamp(Date.now()),
      userId: userId,
      role: userRole,
    };

    const accessToken = await this.jwtService.signAsync(jwtPayload, {
      secret: this.config.get<string>('AT_SECRET'),
      expiresIn: '15m',
    });

    return accessToken;
  }

  async getRefreshToken(userId, userRole) {
    const jwtPayload: JwtPayload = {
      iss: 'url',
      iat: this.toTimestamp(Date.now()),
      userId: userId,
      role: userRole,
    };

    const refreshToken = await this.jwtService.signAsync(jwtPayload, {
      secret: this.config.get<string>('RT_SECRET'),
      expiresIn: '7d',
    });

    return refreshToken;
  }

  async getTokens(userId, userRole) {
    return {
      access_token: await this.getAccessToken(userId, userRole),
      refresh_token: await this.getRefreshToken(userId, userRole),
    };
  }
}
