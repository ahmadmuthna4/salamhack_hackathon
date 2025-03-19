// exercise.repository.ts
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Exercise } from './entities/exercise.entity';
import { DataSource, DeleteResult, Repository } from 'typeorm';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { IRepository } from '../common/interfaces/repository.interfance.tsrepository.interfance';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { GetExerciseDto } from './dto/get-exercise.dto';
import { GetAll } from '../common/interfaces/get-all.interface';
import { Podcast } from 'src/podcast/entities/podcast.entity';

@Injectable()
export class ExerciseRepository {
  constructor(
    @InjectRepository(Exercise) private exerciseRepo: Repository<Exercise>,
    private dataSource: DataSource,
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

  // async update(id: number, updateDto: UpdateExerciseDto) {
  //   const exercise = await this.getById(id, {});
  //   const { question, answer_choices, correct_answer, user_answer } = updateDto;

  //   exercise.question = question ?? exercise.question;
  //   exercise.answer_choices = answer_choices ?? exercise.answer_choices;
  //   exercise.correct_answer = correct_answer ?? exercise.correct_answer;
  //   exercise.user_answer = user_answer ?? exercise.user_answer;

  //   if (exercise.user_answer === exercise.correct_answer) {
  //     exercise.status = 'Correct';
  //   } else {
  //     exercise.status = 'Not_Correct';
  //   }
  //   await this.exerciseRepo.save(exercise);

  //   return { isCorrect: exercise.user_answer === exercise.correct_answer };
  // }

  async update(id: number, updateDto: UpdateExerciseDto) {
    const exercise = await this.getById(id, {});
    const { question, answer_choices, correct_answer, user_answer } = updateDto;

    exercise.question = question ?? exercise.question;
    exercise.answer_choices = answer_choices ?? exercise.answer_choices;
    exercise.correct_answer = correct_answer ?? exercise.correct_answer;
    exercise.user_answer = user_answer ?? exercise.user_answer;

    // Check if the answer is correct
    const isCorrect = exercise.user_answer === exercise.correct_answer;
    exercise.status = isCorrect ? 'Correct' : 'Not_Correct';

    // Save the updated exercise
    await this.exerciseRepo.save(exercise);

    // Update the podcast score using dataSource
    if (exercise.podcast_id) {
      await this.dataSource
        .createQueryBuilder()
        .update(Podcast)
        .set({ score: () => `score ${isCorrect ? '+ 1' : '- 1'}` })
        .where('id = :podcastId', { podcastId: exercise.podcast_id })
        .execute();
    }

    return { isCorrect };
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
