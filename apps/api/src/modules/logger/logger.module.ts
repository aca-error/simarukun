import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from './logger.service';
import { LoggerInterceptor } from './logger.interceptor';

@Global()
@Module({
  providers: [
    {
      provide: LoggerService,
      useFactory: (configService: ConfigService) =>
        new LoggerService('HTTP', configService),
      inject: [ConfigService],
    },
    LoggerInterceptor,
  ],
  exports: [LoggerService, LoggerInterceptor],
})
export class LoggerModule {}
