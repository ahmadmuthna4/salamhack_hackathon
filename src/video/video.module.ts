// video.module.ts
import { Module } from '@nestjs/common';
import { VideoService } from './video.service';
import { VideoController } from './video.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Video } from './entities/video.entity';
import { VideoRepository } from './video.repository';
import { UserModule } from '../user/user.module';
import { Keyword } from 'src/keyword/entities/keyword.entity';
import { Transcript } from 'src/transcript/entities/transcript.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Video, Transcript, Keyword]), UserModule],
  controllers: [VideoController],
  providers: [VideoService, VideoRepository],
  exports: [VideoService]
})
export class VideoModule { }