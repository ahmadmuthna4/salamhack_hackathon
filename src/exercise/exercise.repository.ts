// exercise.repository.ts
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Exercise } from './entities/exercise.entity';
import { DeleteResult, Repository } from 'typeorm';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { IRepository } from '../common/interfaces/repository.interfance.tsrepository.interfance';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { GetExerciseDto } from './dto/get-exercise.dto';
import { GetAll } from '../common/interfaces/get-all.interface';

@Injectable()
export class ExerciseRepository
  implements
    IRepository<Exercise, CreateExerciseDto, GetExerciseDto, UpdateExerciseDto>
{
  constructor(
    @InjectRepository(Exercise) private exerciseRepo: Repository<Exercise>,
  ) {}

  async create(createExerciseDto: CreateExerciseDto): Promise<Exercise> {
    const { question, answer_choices, correct_answer, podcast_id } =
      createExerciseDto;
    const exercise = new Exercise();
    exercise.question = question;
    exercise.answer_choices = answer_choices;
    exercise.correct_answer = correct_answer;
    exercise.podcast_id = podcast_id;

    try {
      return await this.exerciseRepo.save(exercise);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getAll(query: GetExerciseDto): Promise<GetAll<Exercise>> {
    const { limit, offset, relations, select } = query;
    const [array, count] = await this.exerciseRepo.findAndCount({
      select: select ?? [],
      take: limit ?? 100,
      skip: offset ?? 0,
      relations: relations ?? [],
      order: { createdAt: 'DESC' },
    });
    return { count, array };
  }

  async getById(id: number, query: GetExerciseDto): Promise<Exercise> {
    const { relations, select } = query;
    const exercise = await this.exerciseRepo.findOne({
      select: select ?? [],
      where: { id },
      relations,
    });
    if (!exercise) throw new NotFoundException('Exercise not found');
    return exercise;
  }

  async update(id: number, updateDto: UpdateExerciseDto): Promise<Exercise> {
    const exercise = await this.getById(id, {});
    const { question, answer_choices, correct_answer } = updateDto;
    exercise.question = question ?? exercise.question;
    exercise.answer_choices = answer_choices ?? exercise.answer_choices;
    exercise.correct_answer = correct_answer ?? exercise.correct_answer;
    return await this.exerciseRepo.save(exercise);
  }

  async delete(id: number): Promise<DeleteResult> {
    const deleted = await this.exerciseRepo.delete({ id });
    if (deleted.affected === 0)
      throw new NotFoundException('Exercise not found');
    return deleted;
  }

  async getByPodcastId(
    podcastId: number,
    query: GetExerciseDto,
  ): Promise<GetAll<Exercise>> {
    const { limit, offset, relations, select } = query;
    const [array, count] = await this.exerciseRepo.findAndCount({
      select: select ?? [],
      take: limit ?? 100,
      skip: offset ?? 0,
      where: { podcast_id: podcastId },
      relations: {
        podcast: {
          video: true,
        },
      },
      order: { createdAt: 'DESC' },
    });
    return { count, array };
  }
}
