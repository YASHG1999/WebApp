import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { VerifyOtpDto } from './dto';
import { OtpDto } from './dto/otp.dto';
import { refreshTokenDto } from "./dto/refresh-token.dto";

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('otp')
  otp(@Body() otpDto: OtpDto) {
    const m = this.authService.otp(otpDto);
    return m;
  }

  @Post('verify-otp')
  verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    const aa = this.authService.verifyOtp(verifyOtpDto);
    return aa;
  }

  @Post('token')
  token(@Body() refreshToken: refreshTokenDto) {
    const a = this.authService.refreshTokens(refreshToken);
    return a;
  }
}
