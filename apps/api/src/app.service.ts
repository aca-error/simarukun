import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'SimaRukun API - Enterprise Edition v1.0.0';
  }
}
