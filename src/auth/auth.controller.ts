import {
  Body,
  Controller,
  Post,
  UseGuards,
  Headers,
  UseFilters,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { VerifyOtpDto } from './dto';
import { OtpDto } from './dto/otp.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LogoutDto } from './dto/logout.dto';
import { ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '../core/guards/auth.guard';
import { HttpExceptionFilter } from '../core/http-exception.filter';

@Controller()
@UseGuards(AuthGuard)
@UseFilters(HttpExceptionFilter)
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiBody({ type: OtpDto })
  @Post('otp')
  otp(@Headers('token') token, @Body() otpDto: OtpDto) {
    const m = this.authService.generateOtp(token, otpDto);
    return m;
  }

  @ApiBody({ type: VerifyOtpDto })
  @Post('verify-otp')
  verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    const aa = this.authService.verifyOtp(verifyOtpDto);
    return aa;
  }

  @ApiBody({ type: RefreshTokenDto })
  @Post('token')
  token(@Body() refreshToken: RefreshTokenDto) {
    const a = this.authService.useRefreshToken(refreshToken);
    return a;
  }

  @ApiBody({ type: LogoutDto })
  @Post('logout')
  logout(@Body() logoutDto: LogoutDto) {
    const a = this.authService.logout(logoutDto);
    return a;
  }
}
