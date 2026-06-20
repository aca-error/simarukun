import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AduanController } from './aduan.controller';
import { AduanService } from './aduan.service';
import { Aduan } from './entities/aduan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Aduan])],
  controllers: [AduanController],
  providers: [AduanService],
  exports: [AduanService],
})
export class AduanModule {}
