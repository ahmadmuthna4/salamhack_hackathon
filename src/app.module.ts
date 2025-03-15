import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { typeOrmConfigAsync } from './common/config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TranscriptModule } from './transcript/transcript.module';
import { VideoModule } from './video/video.module';
import { AudioFileModule } from './audio-file/audio-file.module';
import { KeywordModule } from './keyword/keyword.module';
import { PodcastModule } from './podcast/podcast.module';
import { ExerciseModule } from './exercise/exercise.module';
import { UserProgressModule } from './user-progress/user-progress.module';


@Module({
  imports: [
    TypeOrmModule.forRootAsync(typeOrmConfigAsync),
    ConfigModule.forRoot(),
    AuthModule,
    UserModule,
    TranscriptModule,
    VideoModule,
    AudioFileModule,
    KeywordModule,
    PodcastModule,
    ExerciseModule,
    UserProgressModule


  ],
})
export class AppModule { }
