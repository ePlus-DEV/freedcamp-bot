import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import * as crypto from 'crypto';

@Injectable()
export class AppService {
  constructor(private httpService: HttpService) {}

  createHash(apiKey: string, timestamp: string, apiSecret: string): string {
    const hmac = crypto.createHmac('sha1', apiSecret);
    hmac.update(apiKey + timestamp);
    return hmac.digest('hex');
  }

  async callApi() {
    const apiKey = process.env.FREEDCAMP_API_KEY;
    const apiSecret = process.env.FREEDCAMP_API_SECRET;
    const timestamp = Date.now().toString();
    const hash = this.createHash(apiKey, timestamp, apiSecret);

    const response = await this.httpService
      .get(
        `https://freedcamp.com/api/v1/sessions/current?api_key=${apiKey}&timestamp=${timestamp}&hash=${hash}`,
      )
      .toPromise();

    return response.data;
  }
}
