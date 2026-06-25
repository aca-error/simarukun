import { Injectable } from '@nestjs/common';

@Injectable()
export class LaporanService {
  getStatus() {
    return {
      module: 'laporan',
      status: 'skeleton',
      message: 'Laporan module placeholder — implement in TASK-210',
    };
  }
}
