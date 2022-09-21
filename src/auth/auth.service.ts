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
import { Repository, MoreThan } from 'typeorm';
import { OtpTokensEntity } from './otp-tokens.entity';
import { RefreshTokenEntity } from './refresh-token.entity';
import { add, isBefore } from 'date-fns';
import { DevicesEntity } from '../user/devices.entity';
import { Config } from '../config/configuration';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    private jwtTokenService: JwtTokenService,
    private configService: ConfigService<Config, true>,
    private userService: UserService,
    private httpService: HttpService,
    private smsService: SmsService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(OtpTokensEntity)
    private readonly otpTokensRepository: Repository<OtpTokensEntity>,
    @InjectRepository(RefreshTokenEntity)
    private readonly refreshTokenRepository: Repository<RefreshTokenEntity>,
    @InjectRepository(DevicesEntity)
    private readonly devicesRepository: Repository<DevicesEntity>,
  ) {}

  async generateOtp(userId, otpDto: OtpDto) {
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

    const otpData = await this.otpTokensRepository.findOne({
      where: {
        phone_number: otpDto.phone_number,
        valid_till: MoreThan(new Date(Date.now())),
      },
      order: { created_at: 'desc' },
    });

    // limit check on otp
    if (otpData == null) {
      await this.otpTokensRepository.save({
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
      await this.otpTokensRepository.save(otpData);
    }

    const message = 'Please find your OTP for verification : ' + otp;

    if (this.configService.get<string>('appEnv') != 'development') {
      await this.smsService.sendOtpSmsTwilio(
        otpDto.country_code,
        otpDto.phone_number,
        message,
      );
    }

    // SHOULD WE GET NEW USER FLAG FOR UNVERIFIED CONSUMER
    const user = await this.userRepository.findOne({
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

  async verifyOtp(verifyOtpDto: VerifyOtpDto, requiredRole?: string) {
    //retry check, order by - updated_at
    const otpToken = await this.otpTokensRepository.findOne({
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

    await this.otpTokensRepository.delete({
      phone_number: verifyOtpDto.phone_number,
    });

    let user = await this.userService.getUserFromPhone(
      verifyOtpDto.phone_number,
    );

    if (requiredRole) {
      if (!user || user.roles.indexOf(UserRole[requiredRole]) < 0)
        throw new HttpException(
          { message: 'Access forbidden' },
          HttpStatus.FORBIDDEN,
        );
    }

    if (user == null) {
      user = await this.userRepository.save({
        id: otpToken.user_id,
        phone_number: verifyOtpDto.phone_number,
        roles: [UserRole.VISITOR, UserRole.CONSUMER],
        is_verified: true,
      });
    } else if (user.is_verified == false) {
      user.is_verified = true;
      user = await this.userRepository.save(user);
    }

    const tokens = await this.jwtTokenService.getTokens(user.id, user.roles);

    await this.refreshTokenRepository.save({
      token: tokens.refresh_token,
      user_id: user.id,
    });

    return { ...tokens, user };
  }

  async useRefreshToken(refreshTokenDto: RefreshTokenDto) {
    try {
      await this.jwtTokenService.verifyJwt(refreshTokenDto.refresh_token);
    } catch (e) {
      throw new HttpException({ message: 'Refresh Token is Invalid' }, 469);
    }

    const refreshToken = await this.refreshTokenRepository.findOne({
      where: { token: refreshTokenDto.refresh_token },
    });

    if (refreshToken == null) {
      throw new HttpException({ message: 'Refresh Token is Invalid' }, 469);
    }

    const user = await this.userRepository.findOne({
      where: { id: refreshToken.user_id },
    });
    // user check

    const tokens = await this.jwtTokenService.getTokens(user.id, user.roles);

    await this.refreshTokenRepository.delete({ id: refreshToken.id });

    await this.refreshTokenRepository.save({
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
    await this.refreshTokenRepository.delete({
      token: logoutDto.refresh_token,
      user_id: userId,
    });

    await this.devicesRepository.update(
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
