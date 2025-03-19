// exercise.module.ts
import { Module } from '@nestjs/common';
import { ExerciseService } from './exercise.service';
import { ExerciseController } from './exercise.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exercise } from './entities/exercise.entity';
import { ExerciseRepository } from './exercise.repository';
import { PodcastModule } from '../podcast/podcast.module';
import { Podcast } from 'src/podcast/entities/podcast.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Exercise, Podcast]), PodcastModule],
  controllers: [ExerciseController],
  providers: [ExerciseService, ExerciseRepository],
  exports: [ExerciseService],
})
export class ExerciseModule {}
