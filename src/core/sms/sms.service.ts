import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import * as twilio from 'twilio';

@Injectable()
export class SmsService {
  constructor(private httpService: HttpService) {}

  async sendOtpSmsApiCall(countryCode, phoneNumber, message) {
    const encodedParams = new URLSearchParams();
    encodedParams.append('to', countryCode + phoneNumber);
    encodedParams.append(
      'p',
      '9ejVerzptxA26ORdI8qj3cQmeW0t9F2uiHmFqRR06EYZRzUUCy0XmOlDdjHbaNEJ',
    );
    encodedParams.append('text', message);

    const options = {
      method: 'POST',
      url: 'https://sms77io.p.rapidapi.com/sms',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'X-RapidAPI-Key': '003ed888a2msh4d5e22e63ee05bep151b4fjsnd4674d78a241',
        'X-RapidAPI-Host': 'sms77io.p.rapidapi.com',
      },
      data: encodedParams,
    };

    await this.httpService.axiosRef.request(options);
  }

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
}
