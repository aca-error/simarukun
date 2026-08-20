import { BackupService } from './backup.service';
export declare class BackupController {
    private readonly backupService;
    constructor(backupService: BackupService);
    getStatus(): {
        module: string;
        status: string;
        message: string;
    };
}
