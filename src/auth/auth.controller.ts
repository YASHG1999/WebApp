import {
  Body,
  Controller,
  Post,
  Headers,
  UseFilters,
  HttpStatus,
  HttpCode,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { VerifyOtpDto } from './dto';
import { OtpDto } from './dto/otp.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LogoutDto } from './dto/logout.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from '../core/http-exception.filter';
import { Roles } from 'src/core/common/custom.decorator';
import { UserRole } from 'src/user/enum/user.role';
import { RegisterFranchiseStoreDto } from './dto/register-franchise-store.dto';

@Controller()
@ApiTags('Auth')
@UseFilters(HttpExceptionFilter)
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiBody({ type: OtpDto })
  @Roles(UserRole.VISITOR)
  @Post('otp')
  otp(@Headers('userId') userId, @Body() otpDto: OtpDto) {
    const m = this.authService.generateOtp(userId, otpDto);
    return m;
  }

  @ApiBody({ type: VerifyOtpDto })
  @Roles(UserRole.VISITOR)
  @Post('verify-otp')
  verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    const aa = this.authService.verifyOtp(verifyOtpDto);
    return aa;
  }

  @ApiBody({ type: OtpDto })
  @Post('admin/otp')
  otpAdmin(@Body() otpDto: OtpDto) {
    return this.authService.generateOtp(null, otpDto);
  }

  @ApiBody({ type: VerifyOtpDto })
  @Post('admin/verify-otp')
  verifyOtpAdmin(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.authService.verifyOtp(verifyOtpDto, 'ADMIN');
  }

  @ApiBody({ type: RefreshTokenDto })
  @Post('refresh')
  token(@Body() refreshToken: RefreshTokenDto) {
    const a = this.authService.useRefreshToken(refreshToken);
    return a;
  }

  @ApiBody({ type: LogoutDto })
  @Roles(UserRole.VISITOR, UserRole.CONSUMER)
  @Post('logout')
  logout(@Headers('userId') userId, @Body() logoutDto: LogoutDto) {
    const a = this.authService.logout(userId, logoutDto);
    return a;
  }

  @ApiBody({ type: RegisterFranchiseStoreDto })
  @Roles(UserRole.ADMIN)
  @Post('franchise-store/register')
  @HttpCode(HttpStatus.CREATED)
  registerFranchiseStore(
    @Headers('userId') userId,
    @Body() registerFranchiseStoreDto: RegisterFranchiseStoreDto,
  ) {
    const m = this.authService.registerFranchiseStore(
      userId,
      registerFranchiseStoreDto,
    );
    return m;
  }

  @ApiBody({ type: OtpDto })
  @Roles(UserRole.VISITOR)
  @Post('franchise-store/otp')
  @HttpCode(HttpStatus.OK)
  otpFranchiseStore(@Headers('userId') userId, @Body() otpDto: OtpDto) {
    const m = this.authService.otpFranchiseStore(userId, otpDto);
    return m;
  }

  @ApiBody({ type: VerifyOtpDto })
  @Roles(UserRole.VISITOR)
  @Post('franchise-store/verify-otp')
  @HttpCode(HttpStatus.OK)
  verifyOtpFranchiseStore(
    @Headers('userId') userId,
    @Body() verifyOtpDto: VerifyOtpDto,
  ) {
    const m = this.authService.verifyOtpFranchiseStore(verifyOtpDto);
    return m;
  }

  @Roles(UserRole.FRANCHISEOWNER)
  @Get('franchise-store/list')
  @HttpCode(HttpStatus.OK)
  getFranchiseStores(@Headers('userId') userId) {
    const m = this.authService.getStores(userId);
    return m;
  }
}
