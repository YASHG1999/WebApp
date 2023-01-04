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
import { DataSource, LessThanOrEqual, MoreThan, Repository } from 'typeorm';
import { OtpTokensEntity } from './otp-tokens.entity';
import { RefreshTokenEntity } from './refresh-token.entity';
import { add, isBefore } from 'date-fns';
import { DevicesEntity } from '../user/devices.entity';
import { Config } from '../config/configuration';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterFranchiseStoreDto } from './dto/register-franchise-store.dto';
import { UserStoreMappingService } from '../user_store/user-store-mapping.service';
import { UserStoreMappingEntity } from '../user_store/user-store-mapping.entity';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    private jwtTokenService: JwtTokenService,
    private configService: ConfigService<Config, true>,
    private userService: UserService,
    private userStoreMappingService: UserStoreMappingService,
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
    @InjectRepository(UserStoreMappingEntity)
    private readonly userStoreMappingRepository: Repository<UserStoreMappingEntity>,
    private dataSource: DataSource,
  ) {}

  async generateOtp(userId, otpDto: OtpDto) {
    await this.otpTokensRepository.update(
      {
        phone_number: otpDto.phone_number,
        valid_till: LessThanOrEqual(new Date(Date.now())),
        is_active: true,
      },
      { is_active: false },
    );

    if (
      this.configService.get<string>('appEnv') != 'development' &&
      otpDto.verificationId != null
    ) {
      const otp_valid_time = add(new Date(Date.now()), {
        minutes: this.configService.get('otp_expiry_in_minutes'),
      });

      await this.otpTokensRepository.save({
        verification_type: 'FIREBASE',
        verification_id: otpDto.verificationId,
        phone_number: otpDto.phone_number,
        valid_till: otp_valid_time,
        user_id: userId,
        retries_count: 0,
        is_active: true,
      });

      const user = await this.userRepository.findOne({
        where: {
          phone_number: otpDto.phone_number,
          is_verified: true,
          is_deleted: false,
        },
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
    } else {
      let otp = '123456';
      if (
        this.configService.get<string>('appEnv') !== 'development' &&
        !this.existsInWhitelist(otpDto.phone_number)
      ) {
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
          is_active: true,
        },
        order: { created_at: 'desc' },
      });

      // limit check on otp
      if (otpData == null) {
        await this.otpTokensRepository.save({
          verification_type: 'GUPSHUP',
          otp: otp,
          phone_number: otpDto.phone_number,
          user_id: userId,
          valid_till: otp_valid_time,
          retries_count: 0,
          is_active: true,
        });
      } else if (otpData.retries_count >= otpData.retries_allowed) {
        throw new HttpException(
          { message: 'OTP retry count exceeded' },
          HttpStatus.BAD_REQUEST,
        );
      } else {
        otp = otpData.otp;
        otpData.retries_count = otpData
          ? otpData.retries_count
            ? otpData.retries_count + 1
            : 1
          : 1;
        otpData.valid_till = otp_valid_time;
        await this.otpTokensRepository.save(otpData);
      }

      if (
        this.configService.get<string>('appEnv') !== 'development' &&
        !this.existsInWhitelist(otpDto.phone_number)
      ) {
        await this.smsService.sendSmsGupshup(
          otpDto.country_code,
          otpDto.phone_number,
          [otp],
        );
        console.log('otp sent to : ' + otpDto.phone_number);
      }

      // SHOULD WE GET NEW USER FLAG FOR UNVERIFIED CONSUMER
      const user = await this.userRepository.findOne({
        where: {
          phone_number: otpDto.phone_number,
          is_verified: true,
          is_deleted: false,
        },
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
  }

  existsInWhitelist(phone_number: string): boolean {
    return this.configService
      .get<string[]>('sms_whitelist')
      .includes(phone_number);
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto, requiredRole?: string) {
    const otpToken = await this.otpTokensRepository.findOne({
      where: {
        phone_number: verifyOtpDto.phone_number,
        is_active: true,
      },
      order: { created_at: 'desc' },
    });

    if (
      this.configService.get<string>('appEnv') != 'development' &&
      otpToken != null &&
      otpToken.verification_id != null
    ) {
      const status = await this.smsService.firebaseApiCall(
        otpToken.verification_id,
        verifyOtpDto.otp,
      );
      if (status != 200) {
        throw new HttpException(
          { message: 'OTP does not match' },
          HttpStatus.BAD_REQUEST,
        );
      }

      otpToken.is_active = false;
      await this.otpTokensRepository.save(otpToken);

      let user = await this.userService.getUserFromPhone(
        verifyOtpDto.phone_number,
      );

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
    } else {
      if (otpToken == null)
        throw new HttpException(
          { message: 'OTP not in use' },
          HttpStatus.BAD_REQUEST,
        );

      if (isBefore(otpToken.valid_till, new Date(Date.now()))) {
        otpToken.is_active = false;
        await this.otpTokensRepository.save(otpToken);
        throw new HttpException(
          { message: 'OTP has expired' },
          HttpStatus.BAD_REQUEST,
        );
      }

      if (otpToken.retries_count >= otpToken.retries_allowed) {
        throw new HttpException(
          { message: 'OTP retry count exceeded' },
          HttpStatus.BAD_REQUEST,
        );
      }

      if (otpToken.otp != verifyOtpDto.otp) {
        otpToken.retries_count = otpToken.retries_count
          ? otpToken.retries_count + 1
          : 1;
        await this.otpTokensRepository.save(otpToken);
        throw new HttpException(
          { message: 'OTP does not match' },
          HttpStatus.BAD_REQUEST,
        );
      }

      let user = await this.userService.getUserFromPhone(
        verifyOtpDto.phone_number,
      );

      if (requiredRole) {
        if (!user || user.roles.indexOf(UserRole[requiredRole]) < 0) {
          otpToken.retries_count = otpToken.retries_count
            ? otpToken.retries_count + 1
            : 1;
          await this.otpTokensRepository.save(otpToken);
          throw new HttpException(
            { message: 'Access forbidden' },
            HttpStatus.FORBIDDEN,
          );
        }
      }

      otpToken.is_active = false;
      await this.otpTokensRepository.save(otpToken);

      if (user == null) {
        user = await this.userRepository.save({
          id: otpToken.user_id,
          phone_number: verifyOtpDto.phone_number,
          roles: [UserRole.VISITOR, UserRole.CONSUMER],
          is_verified: true,
        });
      } else {
        let userChanged = false;
        if (!user.roles.includes(UserRole.CONSUMER)) {
          user.roles.push(UserRole.CONSUMER);
          userChanged = true;
        }

        if (user.is_verified == false) {
          user.is_verified = true;
          userChanged = true;
        }

        if (userChanged) await this.userRepository.save(user);
      }

      const tokens = await this.jwtTokenService.getTokens(user.id, user.roles);

      await this.refreshTokenRepository.save({
        token: tokens.refresh_token,
        user_id: user.id,
      });

      return { ...tokens, user };
    }
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

    // await this.devicesRepository.update(
    //   { device_id: logoutDto.device_id },
    //   { is_active: false },
    // );

    // hard delete refresh token [user-check], mark device linked with user as inactive (soft delete)

    return {
      success: true,
      message: 'logged out successfully',
    };
  }

  checkOtpValidity(otpToken: OtpTokensEntity) {
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
  }

  getOtp(otpDto: OtpDto) {
    let otp = '123456';
    if (
      this.configService.get('appEnv') != 'development' &&
      !this.existsInWhitelist(otpDto.phone_number)
    ) {
      otp = generate(this.configService.get('otp_digits'), {
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
      });
    }
    return otp;
  }

  async otpFranchiseStore(userId, otpDto: OtpDto) {
    const user = await this.userRepository.findOne({
      where: {
        phone_number: otpDto.phone_number,
        is_verified: true,
        is_deleted: false,
      },
    });

    if (user == null || !user.roles.includes(UserRole.FRANCHISEOWNER)) {
      throw new HttpException(
        { message: 'This phone number is not registered.' },
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.otpTokensRepository.update(
      { phone_number: otpDto.phone_number },
      { is_active: false },
    );

    const otp = this.getOtp(otpDto);

    const otp_valid_time = add(new Date(Date.now()), {
      minutes: this.configService.get('otp_expiry_in_minutes'),
    });

    await this.otpTokensRepository.save({
      verification_type: 'GUPSHUP',
      otp: otp,
      phone_number: otpDto.phone_number,
      user_id: user.id,
      valid_till: otp_valid_time,
      retries_count: 0,
      is_active: true,
    });

    if (
      this.configService.get<string>('appEnv') != 'development' &&
      !this.existsInWhitelist(otpDto.phone_number)
    ) {
      await this.smsService.sendSmsGupshup(
        otpDto.country_code,
        otpDto.phone_number,
        [otp],
      );
    }

    return {
      name: user.name,
      isNewUser: false,
      success: true,
      message: 'otp sent successfully',
    };
  }

  async verifyOtpFranchiseStore(verifyOtpDto: VerifyOtpDto) {
    const otpToken = await this.otpTokensRepository.findOne({
      where: {
        phone_number: verifyOtpDto.phone_number,
        otp: verifyOtpDto.otp,
        is_active: true,
      },
      order: { updated_at: 'desc' },
    });

    this.checkOtpValidity(otpToken);

    otpToken.is_active = false;
    await this.otpTokensRepository.save(otpToken);

    const user = await this.userService.getUserFromPhone(
      verifyOtpDto.phone_number,
    );

    if (user == null) {
      throw new HttpException(
        { message: 'This phone number is not registered' },
        HttpStatus.BAD_REQUEST,
      );
    }

    const tokens = await this.jwtTokenService.getTokensNew({
      userId: user.id,
      roles: user.roles,
    });

    await this.refreshTokenRepository.save({
      token: tokens.refresh_token,
      user_id: user.id,
    });

    return { ...tokens, user };
  }

  async getStores(userId) {
    const userStoreMapping = await this.userStoreMappingRepository.find({
      where: {
        user_id: userId,
        is_active: true,
      },
      select: ['store_id'],
    });

    if (userStoreMapping.length == 0) {
      throw new HttpException(
        { message: 'User does not have a mapped store' },
        HttpStatus.BAD_REQUEST,
      );
      return;
    }
    const stores = [];
    userStoreMapping.forEach((element) => {
      stores.push(element.store_id);
    });

    const obj = { stores: stores };
    return this.getStoreInfo(obj);
  }

  async getStoreInfo(storeId: any): Promise<any> {
    try {
      const resp = await firstValueFrom(
        this.httpService.request({
          method: 'post',
          data: storeId,
          baseURL:
            this.configService.get<string>('warehouse_url') +
            '/api/v1/store/info',
          headers: {
            'content-type': 'application/json',
            'rz-auth-key': this.configService.get<string>('rz_auth_key'),
          },
        }),
      );
      return resp.data;
    } catch (e) {
      console.log(e);
      throw new HttpException(
        { message: 'Something went wrong while fetching data from Warehouse.' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async registerFranchiseStore(
    userId,
    registerFranchiseStoreDto: RegisterFranchiseStoreDto,
  ) {
    let user = await this.userRepository.findOne({
      where: {
        phone_number: registerFranchiseStoreDto.phone_number,
        is_verified: true,
        is_deleted: false,
      },
    });

    if (user != null) {
      throw new HttpException(
        { message: 'User is already registered' },
        HttpStatus.BAD_REQUEST,
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (user == null) {
        const user1 = {
          name: registerFranchiseStoreDto.name,
          phone_number: registerFranchiseStoreDto.phone_number,
          roles: [UserRole.VISITOR, UserRole.FRANCHISEOWNER],
          is_verified: true,
        };

        user = new UserEntity();
        Object.assign(user, user1);

        user = await queryRunner.manager.save(user);

        const userStoreMapping1 = {
          user_id: user.id,
          store_id: registerFranchiseStoreDto.storeId,
        };

        const userStoreMapping = new UserStoreMappingEntity();
        Object.assign(userStoreMapping, userStoreMapping1);

        await queryRunner.manager.save(userStoreMapping);

        await queryRunner.commitTransaction();
      }
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(
        { message: 'Something went wrong.' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      await queryRunner.release();
    }

    return user;
  }
}
