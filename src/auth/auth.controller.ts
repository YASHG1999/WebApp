import { Body, Controller, Post, Headers, UseFilters } from '@nestjs/common';
import { AuthService } from './auth.service';
import { VerifyOtpDto } from './dto';
import { OtpDto } from './dto/otp.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LogoutDto } from './dto/logout.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from '../core/http-exception.filter';
import { Auth, Roles } from 'src/core/common/custom.decorator';
import { UserRole } from 'src/user/enum/user.role';

@Controller()
@ApiTags('Auth')
@UseFilters(HttpExceptionFilter)
export class AuthController {
  constructor(private authService: AuthService) { }

  @ApiBody({ type: OtpDto })
  @Auth()
  @Roles(UserRole.VISITOR)
  @Post('otp')
  otp(@Headers('token') token, @Body() otpDto: OtpDto) {
    const m = this.authService.generateOtp(token, otpDto);
    return m;
  }

  @ApiBody({ type: VerifyOtpDto })
  @Auth()
  @Roles(UserRole.VISITOR)
  @Post('verify-otp')
  verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    const aa = this.authService.verifyOtp(verifyOtpDto);
    return aa;
  }

  @ApiBody({ type: RefreshTokenDto })
  @Post('refresh')
  token(@Body() refreshToken: RefreshTokenDto) {
    const a = this.authService.useRefreshToken(refreshToken);
    return a;
  }

  @ApiBody({ type: LogoutDto })
  @Auth()
  @Roles(UserRole.VISITOR)
  @Post('logout')
  logout(@Body() logoutDto: LogoutDto) {
    const a = this.authService.logout(logoutDto);
    return a;
  }
}
