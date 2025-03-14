// transcript.module.ts
import { Module } from '@nestjs/common';
import { TranscriptService } from './transcript.service';
import { TranscriptController } from './transcript.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transcript } from './entities/transcript.entity';
import { TranscriptRepository } from './transcript.repository';
import { VideoModule } from '../video/video.module';

@Module({
  imports: [TypeOrmModule.forFeature([Transcript]), VideoModule],
  controllers: [TranscriptController],
  providers: [TranscriptService, TranscriptRepository],
  exports: [TranscriptService]
})
export class TranscriptModule { }