
// podcast.module.ts
import { Module } from '@nestjs/common';
import { PodcastService } from './podcast.service';
import { PodcastController } from './podcast.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Podcast } from './entities/podcast.entity';
import { PodcastRepository } from './podcast.repository';
import { VideoModule } from '../video/video.module';
import { TranscriptModule } from '../transcript/transcript.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Podcast]),
    VideoModule,
    TranscriptModule
  ],
  controllers: [PodcastController],
  providers: [PodcastService, PodcastRepository],
  exports: [PodcastService]
})
export class PodcastModule { }