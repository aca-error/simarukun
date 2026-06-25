import { Injectable } from '@nestjs/common';

@Injectable()
export class BackupService {
  getStatus() {
    return {
      module: 'backup',
      status: 'skeleton',
      message: 'Backup module placeholder — implement in TASK-211',
    };
  }
}
