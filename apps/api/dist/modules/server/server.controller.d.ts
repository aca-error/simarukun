import { ServerService } from './server.service';
export declare class ServerController {
    private readonly serverService;
    constructor(serverService: ServerService);
    getStatus(): {
        module: string;
        status: string;
        message: string;
    };
}
