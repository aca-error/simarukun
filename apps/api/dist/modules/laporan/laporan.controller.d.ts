import { LaporanService } from './laporan.service';
export declare class LaporanController {
    private readonly laporanService;
    constructor(laporanService: LaporanService);
    getStatus(): {
        module: string;
        status: string;
        message: string;
    };
}
