import { Injectable } from '@nestjs/common';

@Injectable()
export class ServerService {
  getStatus() {
    return {
      module: 'server',
      status: 'skeleton',
      message: 'Server module placeholder — implement in TASK-213',
    };
  }
}
