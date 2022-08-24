import { Module } from '@nestjs/common';
import { JwtTokenService } from './jwt-token.service';
import { JwtModule } from '@nestjs/jwt';
import { CommonService } from '../common/common.service';

@Module({
  imports: [JwtModule.register({})],
  providers: [JwtTokenService, CommonService],
})
export class JwtTokenModule {}
