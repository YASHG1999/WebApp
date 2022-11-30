import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { Config } from '../../config/configuration';

@Injectable()
export class SmsService {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService<Config, true>,
  ) {}
  cleanCountryCode(countryCode: string) {
    return countryCode.replace('+', '');
  }

  async sendSmsGupshup(countryCode, phoneNumber, params): Promise<any> {
    let template =
      'DO NOT SHARE: {#var#} is the OTP for your SORTED account. Keep this OTP to yourself for the safety of your account.\n';

    const re = '{#var#}';
    template = template.replace(re, params[0]);

    const resp = await firstValueFrom(
      this.httpService.request({
        method: 'get',
        baseURL: this.configService.get<string>('gupshup_url'),
        params: {
          method: 'SendMessage',
          send_to: this.cleanCountryCode(countryCode) + phoneNumber,
          msg: template,
          msg_type: 'TEXT',
          userid: this.configService.get<string>('gupshup_userid'),
          auth_scheme: 'plain',
          password: this.configService.get<string>('gupshup_pwd'),
          v: '1.1',
          format: 'text',
        },
      }),
    );

    if (!resp.data.startsWith('success')) {
      throw new HttpException(
        { message: 'Error while sending OTP' },
        HttpStatus.BAD_REQUEST,
      );
    }

    return resp;
  }

  async firebaseApiCall(verificationId, otp) {
    try {
      const resp = await firstValueFrom(
        this.httpService.request({
          method: 'post',
          baseURL: 'https://www.googleapis.com/identitytoolkit/v3',
          url: `/relyingparty/verifyPhoneNumber`,
          params: {
            key: 'AIzaSyBbOKF48fI_oJdQwZLVDGWv84gvh33eb6Q',
          },
          data: {
            code: otp,
            sessionInfo: verificationId,
          },
        }),
      );
      return resp.status;
    } catch (e) {
      return e.response.status;
    }
  }
}
