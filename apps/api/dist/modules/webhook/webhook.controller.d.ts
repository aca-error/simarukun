import { WebhookService } from './webhook.service';
export declare class WebhookController {
    private readonly webhookService;
    constructor(webhookService: WebhookService);
    getStatus(): {
        module: string;
        status: string;
        message: string;
    };
}
