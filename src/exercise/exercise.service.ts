// exercise.service.ts
import { Injectable } from '@nestjs/common';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { IRepository } from '../common/interfaces/repository.interfance.tsrepository.interfance';
import { Exercise } from './entities/exercise.entity';
import { GetExerciseDto } from './dto/get-exercise.dto';
import { ExerciseRepository } from './exercise.repository';
import { DeleteResult } from 'typeorm';
import { GetAll } from '../common/interfaces/get-all.interface';

@Injectable()
export class ExerciseService {
  constructor(private readonly exerciseRepo: ExerciseRepository) {}

  create(createDto: CreateExerciseDto): Promise<Exercise> {
    return this.exerciseRepo.create(createDto);
  }

  getAll(query: GetExerciseDto): Promise<GetAll<Exercise>> {
    return this.exerciseRepo.getAll(query);
  }

  getById(id: number, query: GetExerciseDto): Promise<Exercise> {
    return this.exerciseRepo.getById(id, query);
  }

  update(id: number, updateDto: UpdateExerciseDto) {
    return this.exerciseRepo.update(id, updateDto);
  }

  delete(id: number): Promise<DeleteResult> {
    return this.exerciseRepo.delete(id);
  }

  getByPodcastId(
    podcastId: number,
    query: GetExerciseDto,
  ): Promise<GetAll<Exercise>> {
    return this.exerciseRepo.getByPodcastId(podcastId, query);
  }
}
