
// audio-file.module.ts
import { Module } from '@nestjs/common';
import { AudioFileService } from './audio-file.service';
import { AudioFileController } from './audio-file.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AudioFile } from './entities/audio-file.entity';
import { AudioFileRepository } from './audio-file.repository';
import { PodcastModule } from '../podcast/podcast.module';

@Module({
  imports: [TypeOrmModule.forFeature([AudioFile]), PodcastModule],
  controllers: [AudioFileController],
  providers: [AudioFileService, AudioFileRepository],
  exports: [AudioFileService]
})
export class AudioFileModule { }