import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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
import { UserEntity } from '../user/user.entity';
import { DataSource } from 'typeorm';
import { OtpTokensEntity } from './otp-tokens.entity';
import { RefreshTokenEntity } from './refresh-token.entity';
import { add, isBefore } from 'date-fns';

@Injectable()
export class AuthService {
  constructor(
    private jwtTokenService: JwtTokenService,
    private configService: ConfigService,
    private userService: UserService,
    private httpService: HttpService,
    private smsService: SmsService,
    private dataSource: DataSource,
  ) {}

  async generateOtp(userId: string, otpDto: OtpDto) {
    const otpTokensRepository = this.dataSource.getRepository(OtpTokensEntity);

    let otp = '123456';

    if (this.configService.get<string>('NODE_ENV') != 'development') {
      otp = generate(6, {
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
      });
    }

    const message = 'Please find your OTP for verification : ' + otp;

    if (this.configService.get<string>('NODE_ENV') != 'development') {
      await this.smsService.sendOtpSmsTwilio(
        otpDto.country_code,
        otpDto.phone_number,
        message,
      );
    }

    const otp_valid_time = add(new Date(Date.now()), {
      minutes: this.configService.get<number>('OTP_EXPIRY_IN_MINUTES'),
    });

    const otpData = await otpTokensRepository.findOne({
      where: { phone_number: otpDto.phone_number },
      order: { created_at: 'desc' },
    });

    if (otpData == null) {
      await otpTokensRepository.save({
        otp: otp,
        phone_number: otpDto.phone_number,
        user_id: userId,
        valid_till: otp_valid_time,
        retries_count: 0,
      });
    } else {
      otpData.otp = otp;

      otpData.retries_count = otpData
        ? otpData.retries_count
          ? otpData.retries_count + 1
          : 1
        : 1;

      await otpTokensRepository.save(otpData);
    }

    return {
      success: true,
      message: 'otp sent successfully',
    };
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    const otpTokensRepository = this.dataSource.getRepository(OtpTokensEntity);
    const userRepository = this.dataSource.getRepository(UserEntity);
    const refreshTokenRepository =
      this.dataSource.getRepository(RefreshTokenEntity);

    const otpToken = await otpTokensRepository.findOne({
      where: { phone_number: verifyOtpDto.phone_number, otp: verifyOtpDto.otp },
      order: { created_at: 'desc' },
    });

    if (otpToken == null) {
      throw new HttpException(
        { message: 'OTP does not match' },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (isBefore(otpToken.valid_till, new Date(Date.now()))) {
      throw new HttpException(
        { message: 'OTP has expired' },
        HttpStatus.BAD_REQUEST,
      );
    }

    await otpTokensRepository.delete({
      phone_number: verifyOtpDto.phone_number,
    });

    let user = await this.userService.getUserFromPhone(
      verifyOtpDto.phone_number,
    );

    if (user == null) {
      user = await userRepository.save({
        id: otpToken.user_id,
        phone_number: verifyOtpDto.phone_number,
        roles: [UserRole.VISITOR, UserRole.CONSUMER],
      });
    }

    const tokens = await this.jwtTokenService.getTokens(
      user.id,
      user.roles,
      UserRole.CONSUMER,
    );

    await refreshTokenRepository.save({
      token: tokens.refresh_token,
      user_id: user.id,
    });

    return { ...tokens, user };
  }

  async useRefreshToken(refreshTokenDto: RefreshTokenDto) {
    const refreshTokenRepository =
      this.dataSource.getRepository(RefreshTokenEntity);
    const userRepository = this.dataSource.getRepository(UserEntity);

    const refreshToken = await refreshTokenRepository.findOne({
      where: { token: refreshTokenDto.refresh_token },
    });

    const decodedJwt: JwtPayload = await this.jwtTokenService.decodeJwt(
      refreshToken.token,
    );

    if (decodedJwt.exp < Date.now()) {
      throw new HttpException({ message: 'Refresh Token has expired' }, 469);
    }

    const user = await userRepository.findOne({
      where: { id: refreshToken.user_id },
    });

    const tokens = await this.jwtTokenService.getTokens(
      user.id,
      user.roles,
      (
        await this.jwtTokenService.decodeJwt(refreshToken.token)
      ).defaultRole,
    );

    return {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      user: user,
    };
  }

  async logout(logoutDto: LogoutDto) {
    const refreshTokenRepository =
      this.dataSource.getRepository(RefreshTokenEntity);

    await refreshTokenRepository.findOne({
      where: { token: logoutDto.refresh_token },
    });

    await refreshTokenRepository.update(
      { token: logoutDto.refresh_token },
      { revoked: true },
    );

    return {
      success: true,
      message: 'logged out successfully',
    };
  }
}
