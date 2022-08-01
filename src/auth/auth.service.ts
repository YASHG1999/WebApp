import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
// import * as argon from 'argon2';
import { PrismaService } from '../prisma/prisma.service';
import { JwtPayload, Tokens } from './types';
import { UserService } from '../user/user.service';
import { OtpDto } from './dto/otp.dto';
import { generate } from 'otp-generator';

import { UserRole } from '../user/enum/user.role';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UpdateUserDto } from '../user/dto/update-user.dto';
import { VerifyOtpDto } from './dto';
import { refreshTokenDto } from './dto/refresh-token.dto';

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

    const otpData = await this.prisma.otp_tokens.create({
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

    await this.prisma.refresh_token.create({
      data: {
        token: tokens.refresh_token,
        user_id: user.id,
      },
    });

    return tokens;
  }

  toTimestamp(strDate): number {
    const datum = Date.parse(strDate);
    return datum / 1000;
  }

  async refreshTokens(rt: refreshTokenDto) {
    const otpToken = await this.prisma.refresh_token.findFirst({
      where: {
        token: rt.refreshToken,
      },
    });

    const user = await this.prisma.user.findUnique({
      where: {
        id: otpToken.user_id,
      },
    });

    const tokens = await this.getTokens(otpToken.user_id, user.roles);

    return tokens;
  }

  async getTokens(userId, userRole): Promise<Tokens> {
    const jwtPayload: JwtPayload = {
      iss: 'url',
      iat: this.toTimestamp(Date.now()),
      userId: userId,
      role: userRole,
    };

    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: this.config.get<string>('AT_SECRET'),
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: this.config.get<string>('RT_SECRET'),
        expiresIn: '7d',
      }),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async createUser(dto: CreateUserDto) {
    const user = await this.prisma.user.create({ data: dto });
    return user;
  }

  async getUserFromId(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    return user;
  }

  async updateUser(id: string, dto: UpdateUserDto) {
    const user = await this.prisma.user.update({
      where: {
        id: id,
      },
      data: dto,
    });
    return user;
  }
}
