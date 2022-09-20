import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { OtpDto } from './dto/otp.dto';
import { generate } from 'otp-generator';
import { VerifyOtpDto } from './dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LogoutDto } from './dto/logout.dto';
import { JwtTokenService } from '../core/jwt-token/jwt-token.service';
import { UserRole } from '../user/enum/user.role';
import { HttpService } from '@nestjs/axios';
import { SmsService } from '../core/sms/sms.service';
import { UserEntity } from '../user/user.entity';
import { DataSource } from 'typeorm';
import { OtpTokensEntity } from './otp-tokens.entity';
import { RefreshTokenEntity } from './refresh-token.entity';
import { add, isBefore } from 'date-fns';
import { DevicesEntity } from '../user/devices.entity';
import { Config } from '../config/configuration';

@Injectable()
export class AuthService {
  constructor(
    private jwtTokenService: JwtTokenService,
    private configService: ConfigService<Config, true>,
    private userService: UserService,
    private httpService: HttpService,
    private smsService: SmsService,
    private dataSource: DataSource,
  ) {}

  async generateOtp(userId: string, otpDto: OtpDto) {
    const otpTokensRepository = this.dataSource.getRepository(OtpTokensEntity);
    const userRepository = this.dataSource.getRepository(UserEntity);

    let otp = '123456';

    if (this.configService.get('appEnv') != 'development') {
      otp = generate(this.configService.get('otp_digits'), {
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
      });
    }

    const otp_valid_time = add(new Date(Date.now()), {
      minutes: this.configService.get('otp_expiry_in_minutes'),
    });

    let otpData = await otpTokensRepository.findOne({
      where: { phone_number: otpDto.phone_number },
      order: { created_at: 'desc' },
    });

    // limit check on otp
    if (otpData == null) {
      otpData = await otpTokensRepository.save({
        otp: otp,
        phone_number: otpDto.phone_number,
        user_id: userId,
        valid_till: otp_valid_time,
        retries_count: 0,
      });
    } else if (otpData.retries_count > otpData.retries_allowed) {
      throw new HttpException(
        { message: 'OTP retry count exceeded' },
        HttpStatus.BAD_REQUEST,
      );
    } else {
      otpData.otp = otp;
      otpData.retries_count = otpData
        ? otpData.retries_count
          ? otpData.retries_count + 1
          : 1
        : 1;
      otpData = await otpTokensRepository.save(otpData);
    }

    const message = 'Please find your OTP for verification : ' + otp;

    if (this.configService.get<string>('appEnv') != 'development') {
      await this.smsService.sendOtpSmsTwilio(
        otpDto.country_code,
        otpDto.phone_number,
        message,
      );
    }

    const user = await userRepository.findOne({
      where: { phone_number: otpDto.phone_number },
    });

    let isNewUserFlag = false;

    if (user == null) {
      isNewUserFlag = true;
    }

    return {
      name: user == null ? null : user.name,
      isNewUser: isNewUserFlag,
      success: true,
      message: 'otp sent successfully',
    };
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    const otpTokensRepository = this.dataSource.getRepository(OtpTokensEntity);
    const userRepository = this.dataSource.getRepository(UserEntity);
    const refreshTokenRepository =
      this.dataSource.getRepository(RefreshTokenEntity);

    //retry check, order by - updated_at
    const otpToken = await otpTokensRepository.findOne({
      where: { phone_number: verifyOtpDto.phone_number, otp: verifyOtpDto.otp },
      order: { updated_at: 'desc' },
    });

    if (otpToken == null) {
      throw new HttpException(
        { message: 'OTP does not match' },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (otpToken.retries_count > otpToken.retries_allowed) {
      throw new HttpException(
        { message: 'OTP retry count exceeded' },
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

    const tokens = await this.jwtTokenService.getTokens(user.id, user.roles);

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

    try {
      await this.jwtTokenService.verifyJwt(refreshTokenDto.refresh_token);
    } catch (e) {
      throw new HttpException({ message: 'Refresh Token is Invalid' }, 469);
    }

    const refreshToken = await refreshTokenRepository.findOne({
      where: { token: refreshTokenDto.refresh_token },
    });

    if (refreshToken == null) {
      throw new HttpException({ message: 'Refresh Token is Invalid' }, 469);
    }

    const user = await userRepository.findOne({
      where: { id: refreshToken.user_id },
    });
    // user check

    const tokens = await this.jwtTokenService.getTokens(user.id, user.roles);

    await refreshTokenRepository.delete({ id: refreshToken.id });

    await refreshTokenRepository.save({
      token: tokens.refresh_token,
      user_id: user.id,
    });

    return {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      user: user,
    };
  }

  async logout(userId, logoutDto: LogoutDto) {
    const refreshTokenRepository =
      this.dataSource.getRepository(RefreshTokenEntity);

    const devicesRepository = this.dataSource.getRepository(DevicesEntity);

    await refreshTokenRepository.delete({
      token: logoutDto.refresh_token,
      user_id: userId,
    });

    await devicesRepository.update(
      { device_id: logoutDto.device_id },
      { is_active: false },
    );

    // hard delete refresh token [user-check], mark device linked with user as inactive (soft delete)

    return {
      success: true,
      message: 'logged out successfully',
    };
  }
}
