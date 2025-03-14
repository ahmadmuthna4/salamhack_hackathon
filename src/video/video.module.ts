// video.module.ts
import { Module } from '@nestjs/common';
import { VideoService } from './video.service';
import { VideoController } from './video.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Video } from './entities/video.entity';
import { VideoRepository } from './video.repository';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Video]), UserModule],
  controllers: [VideoController],
  providers: [VideoService, VideoRepository],
  exports: [VideoService]
})
export class VideoModule { }