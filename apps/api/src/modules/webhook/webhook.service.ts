import { Injectable } from '@nestjs/common';

@Injectable()
export class WebhookService {
  getStatus() {
    return {
      module: 'webhook',
      status: 'skeleton',
      message: 'Webhook module placeholder — implement in TASK-212',
    };
  }
}
