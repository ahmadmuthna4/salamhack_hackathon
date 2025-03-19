// podcast.repository.ts
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Podcast } from './entities/podcast.entity';
import { DataSource, DeleteResult, Repository } from 'typeorm';
import { CreatePodcastDto } from './dto/create-podcast.dto';
import { IRepository } from '../common/interfaces/repository.interfance.tsrepository.interfance';
import { UpdatePodcastDto } from './dto/update-podcast.dto';
import { GetPodcastDto } from './dto/get-podcast.dto';
import { GetAll } from '../common/interfaces/get-all.interface';
import { Exercise } from 'src/exercise/entities/exercise.entity';
import * as dotenv from 'dotenv';
import { OpenAI } from 'openai';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

@Injectable()
export class PodcastRepository
  implements
    IRepository<Podcast, CreatePodcastDto, GetPodcastDto, UpdatePodcastDto>
{
  constructor(
    @InjectRepository(Podcast) private podcastRepo: Repository<Podcast>,
    private dataSource: DataSource,
  ) {}

  async create(createPodcastDto: CreatePodcastDto): Promise<Podcast> {
    const { video_id, ai_generated_text } = createPodcastDto;
    const podcast = new Podcast();
    podcast.video_id = video_id;
    // podcast.transcript_id = transcript_id;
    podcast.ai_generated_text = ai_generated_text;

    try {
      return await this.podcastRepo.save(podcast);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getAll(query: GetPodcastDto): Promise<GetAll<Podcast>> {
    const { limit, offset, relations, select } = query;
    const [array, count] = await this.podcastRepo.findAndCount({
      take: limit ?? 100,
      skip: offset ?? 0,
      relations: {
        video: {
          keywords: true,
        },
      },
      order: { createdAt: 'DESC' },
    });
    return { count, array };
  }

  async getById(id: number, query: GetPodcastDto): Promise<Podcast> {
    const { relations, select } = query;
    const podcast = await this.podcastRepo.findOne({
      where: { id },
      relations: relations ?? [],
    });
    if (!podcast) throw new NotFoundException('Podcast not found');
    return podcast;
  }

  async update(id: number, updateDto: UpdatePodcastDto): Promise<Podcast> {
    const { video_id, ai_generated_text } = updateDto;

    // First, update the Podcast
    const podcast = await this.getById(id, { relations: ['exercises'] });
    podcast.video_id = video_id ?? podcast.video_id;
    podcast.ai_generated_text = ai_generated_text ?? podcast.ai_generated_text;

    // Save the updated podcast
    await this.podcastRepo.save(podcast);

    // Generate exercises from the podcast text if ai_generated_text exists
    if (podcast.ai_generated_text) {
      try {
        // Generate exercises from the podcast text
        const generatedExercises = await this.generateExercises(
          podcast.ai_generated_text,
        );

        // Save the generated exercises
        if (generatedExercises && generatedExercises.length > 0) {
          const exerciseRepository = this.dataSource.getRepository(Exercise);

          // Prepare the exercises for bulk insertion
          const exerciseEntities = generatedExercises.map((exercise) => {
            const exerciseEntity = new Exercise();
            exerciseEntity.question = exercise.question;
            exerciseEntity.answer_choices = exercise.answer_choices;
            exerciseEntity.correct_answer = exercise.correct_answer;
            exerciseEntity.podcast = podcast; // Associate the exercise with the podcast
            return exerciseEntity;
          });

          // Save the exercises in bulk
          await exerciseRepository.save(exerciseEntities);
        }
      } catch (error) {
        // Log the error but don't fail the update
        console.error('Failed to generate exercises:', error);
      }
    }

    return podcast;
  }

  private async generateExercises(podcastText: string): Promise<any[]> {
    try {
      // Check if the podcastText is actually usable
      if (!podcastText || podcastText.trim().length < 50) {
        console.log('Podcast text is too short or empty:', podcastText);
        return [];
      }

      // Create a simple example transcript in case the AI needs guidance
      const exampleTranscript = `
        Host: Welcome to our podcast! Today we're discussing the importance of learning languages.
        Guest: Yes, it's incredibly valuable in today's interconnected world.
        Host: What are some of the benefits you've experienced?
        Guest: Well, I've been able to connect with people from different cultures and understand their perspectives better.
      `;

      const prompt = `
      Based on the following podcast transcript, create 20 exercises for language learners. 
      Include reading, writing, and speaking exercises. Each exercise should be formatted as:
      {
        "question": "string",
        "answer_choices": ["string1", "string2", "string3", "string4"],
        "correct_answer": "string"
      }
      If an exercise does not require multiple choices, return an empty array for "answer_choices".
      Use simple and clear language.
      Must answer_choices not empty.

      Podcast Transcript:
      ${podcastText}
    `;

      console.log('Sending prompt to OpenAI');
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content:
              'You are an assistant that creates language learning exercises based on podcast transcripts. Always return a valid JSON array of exercises.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
      });

      const gptResponse = response.choices[0].message.content;
      console.log('GPT response:', gptResponse);

      // Clean up the JSON response - remove markdown formatting
      const cleanJson = gptResponse.replace(/```json|```/g, '').trim();

      // Check if the response is valid JSON
      try {
        const exercises = JSON.parse(cleanJson);
        if (Array.isArray(exercises) && exercises.length > 0) {
          return exercises;
        } else {
          console.log('Response is not a valid array of exercises');
          // return this.generateDefaultExercises();
        }
      } catch (error) {
        console.log('Failed to parse JSON response:', error);
        // return this.generateDefaultExercises();
      }
    } catch (error) {
      console.error('Error generating exercises:', error);
      // return this.generateDefaultExercises();
    }
  }

  // Fallback method to generate default exercises
  private generateDefaultExercises(): any[] {
    return [
      {
        question: 'What skills are important for language learning?',
        answer_choices: [
          'Only reading',
          'Only writing',
          'Only listening',
          'Reading, writing, listening, and speaking',
        ],
        correct_answer: 'Reading, writing, listening, and speaking',
      },
      {
        question: 'How can listening to podcasts help with language learning?',
        answer_choices: [
          'It only helps with vocabulary',
          'It exposes learners to natural speech patterns',
          "It's not helpful for language learning",
          'It only helps with grammar',
        ],
        correct_answer: 'It exposes learners to natural speech patterns',
      },
      {
        question: 'What is a good practice for improving speaking skills?',
        answer_choices: [
          'Only reading books',
          'Regular conversation practice',
          'Memorizing vocabulary lists',
          'Watching movies without subtitles',
        ],
        correct_answer: 'Regular conversation practice',
      },
      {
        question:
          'Why is it important to learn about the culture when learning a language?',
        answer_choices: [
          "It's not important",
          'It helps with grammar rules',
          'It provides context for language use',
          'It only matters for pronunciation',
        ],
        correct_answer: 'It provides context for language use',
      },
      {
        question: 'What is a benefit of learning multiple languages?',
        answer_choices: [
          'It confuses the brain',
          'It improves cognitive abilities',
          'It only helps with travel',
          'It has no real benefits',
        ],
        correct_answer: 'It improves cognitive abilities',
      },
    ];
  }

  async delete(id: number): Promise<DeleteResult> {
    const deleted = await this.podcastRepo.delete({ id });
    if (deleted.affected === 0)
      throw new NotFoundException('Podcast not found');
    return deleted;
  }

  async getByVideoId(
    videoId: number,
    query: GetPodcastDto,
  ): Promise<GetAll<Podcast>> {
    const { limit, offset, relations, select } = query;
    const [array, count] = await this.podcastRepo.findAndCount({
      take: limit ?? 100,
      skip: offset ?? 0,
      relations: relations ?? [],
      where: { video_id: videoId },
      order: { createdAt: 'DESC' },
    });
    return { count, array };
  }

  // async getByTranscriptId(transcriptId: number, query: GetPodcastDto): Promise<GetAll<Podcast>> {
  //     const { limit, offset, relations, select } = query;
  //     const [array, count] = await this.podcastRepo.findAndCount({

  //         take: limit ?? 100,
  //         skip: offset ?? 0,
  //         relations: relations ?? [],
  //         where: { transcript_id: transcriptId },
  //         order: { createdAt: 'DESC' }
  //     });
  //     return { count, array };
  // }
}
