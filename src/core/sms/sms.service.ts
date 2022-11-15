import { HttpException, Injectable } from '@nestjs/common';
import * as twilio from 'twilio';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class SmsService {
  constructor(private httpService: HttpService) {}
  async sendOtpSmsTwilio(countryCode, phoneNumber, message) {
    const accountSid = 'AC212eb07b903da65fa810df249fae5054';
    const authToken = '738f0996179b6d5d04e27e4dd830e566';

    twilio(accountSid, authToken)
      .messages.create({
        body: message,
        from: '+19124204590',
        to: countryCode + phoneNumber,
      })
      .then((message) => console.log(message.sid));
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
