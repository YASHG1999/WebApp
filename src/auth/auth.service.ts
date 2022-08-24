import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';
import { OtpDto } from './dto/otp.dto';
import { generate } from 'otp-generator';
import { VerifyOtpDto } from './dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LogoutDto } from './dto/logout.dto';
import { JwtTokenService } from '../core/jwt-token/jwt-token.service';
import { JwtPayload } from './types';
import { UserRole } from '../user/enum/user.role';
import { HttpService } from '@nestjs/axios';
import { SmsService } from '../core/sms/sms.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtTokenService: JwtTokenService,
    private configService: ConfigService,
    private userService: UserService,
    private httpService: HttpService,
    private smsService: SmsService,
  ) {}

  async generateOtp(token: string, otpDto: OtpDto) {
    let otp = '123456';

    if (this.configService.get<string>('NODE_ENV') != 'development') {
      otp = generate(6, {
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
      });
    }

    const decodedJwt: JwtPayload = await this.jwtTokenService.decodeJwt(token);

    const message = 'Please find your OTP for verification : ' + otp;

    if (this.configService.get<string>('NODE_ENV') != 'development') {
      await this.smsService.sendOtpSmsTwilio(
        otpDto.country_code,
        otpDto.phone_number,
        message,
      );
    }

    const otp_valid_time = new Date(
      Date.now() + this.configService.get<number>('OTP_VALIDITY') * 1000,
    );

    let otpData = await this.prisma.otp_tokens.findFirst({
      where: {
        phone_number: otpDto.phone_number,
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    if (otpData == null) {
      otpData = await this.prisma.otp_tokens.create({
        data: {
          otp: otp,
          phone_number: otpDto.phone_number,
          user_id: decodedJwt.userId,
          valid_till: otp_valid_time,
          retries_count: 0,
        },
      });
    } else {
      otpData = await this.prisma.otp_tokens.update({
        where: { id: otpData.id },
        data: {
          otp: otp,
          retries_count: otpData
            ? otpData.retries_count
              ? otpData.retries_count + 1
              : 1
            : 1,
        },
      });
    }

    return {
      success: true,
      message: 'otp sent successfully',
    };
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    const otpToken = await this.prisma.otp_tokens.findFirst({
      where: {
        phone_number: verifyOtpDto.phone_number,
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    await this.prisma.otp_tokens.deleteMany({
      where: {
        phone_number: verifyOtpDto.phone_number,
      },
    });

    if (verifyOtpDto.otp != otpToken.otp) {
      throw new HttpException('OTP does not match', HttpStatus.BAD_REQUEST);
    }

    let user = await this.userService.getUserFromPhone(
      verifyOtpDto.phone_number,
    );

    if (user == null) {
      user = await this.prisma.user.update({
        where: {
          id: otpToken.user_id,
        },
        data: {
          phone_number: verifyOtpDto.phone_number,
          roles: [UserRole.CONSUMER],
        },
      });
    }

    const tokens = await this.jwtTokenService.getTokens(user.id, user.roles);

    await this.prisma.refresh_token.create({
      data: {
        token: tokens.refresh_token,
        user_id: user.id,
      },
    });

    return { ...tokens, user };
  }

  async useRefreshToken(refreshTokenDto: RefreshTokenDto) {
    const refreshToken = await this.prisma.refresh_token.findFirst({
      where: {
        token: refreshTokenDto.refresh_token,
      },
    });

    const decodedJwt: JwtPayload = await this.jwtTokenService.decodeJwt(
      refreshToken.token,
    );

    if (decodedJwt.exp < Date.now()) {
      throw new HttpException(
        'Refresh Token has expired',
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id: refreshToken.user_id,
      },
    });

    const at = await this.jwtTokenService.getAccessToken(user.id, user.roles);

    return {
      access_token: at,
      refresh_token: refreshTokenDto.refresh_token,
      user: user,
    };
  }

  async logout(logoutDto: LogoutDto) {
    await this.prisma.refresh_token.update({
      where: {
        token: logoutDto.refresh_token,
      },
      data: {
        revoked: true,
      },
    });

    return {
      success: true,
      message: 'logged out successfully',
    };
  }
}
