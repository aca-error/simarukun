import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IuranController } from './iuran.controller';
import { IuranService } from './iuran.service';
import { Iuran } from './entities/iuran.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Iuran])],
  controllers: [IuranController],
  providers: [IuranService],
  exports: [IuranService],
})
export class IuranModule {}
