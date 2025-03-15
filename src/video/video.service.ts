// video.service.ts
import { BadRequestException, Injectable } from '@nestjs/common';
import {
  CreateVideoDto,
  CreateVideoWithRelatedDto,
} from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { IRepository } from '../common/interfaces/repository.interfance.tsrepository.interfance';
import { Video } from './entities/video.entity';
import { GetVideoDto } from './dto/get-video.dto';
import { VideoRepository } from './video.repository';
import { DataSource, DeleteResult, Repository } from 'typeorm';
import { GetAll } from '../common/interfaces/get-all.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Keyword } from 'src/keyword/entities/keyword.entity';
import { Transcript } from 'src/transcript/entities/transcript.entity';

@Injectable()
export class VideoService
  implements IRepository<Video, CreateVideoDto, GetVideoDto, UpdateVideoDto>
{
  constructor(
    private readonly videoRepo: VideoRepository,

    @InjectRepository(Transcript)
    private readonly transcriptsRepository: Repository<Transcript>,
    @InjectRepository(Keyword)
    private readonly keywordsRepository: Repository<Keyword>,
    private dataSource: DataSource,
  ) {}

  async createVideoWithRelated(dto: CreateVideoWithRelatedDto, userId: number) {
    // Start a transaction to ensure data consistency
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Create the video
      const video = await this.videoRepo.create({
        ...dto.video,
        user_id: userId,
      });

      const savedVideo = await queryRunner.manager.save(Video, video);

      // Create and save all transcripts
      const savedTranscripts = [];
      for (const transcriptDto of dto.transcripts) {
        const transcript = this.transcriptsRepository.create({
          ...transcriptDto,
          video_id: savedVideo.id,
        });
        const savedTranscript = await queryRunner.manager.save(
          Transcript,
          transcript,
        );
        savedTranscripts.push(savedTranscript);
      }

      // Create and save all keywords
      const savedKeywords = [];
      for (const keywordDto of dto.keywords) {
        const keyword = this.keywordsRepository.create({
          ...keywordDto,
          video_id: savedVideo.id,
        });

        const savedKeyword = await queryRunner.manager.save(Keyword, keyword);
        savedKeywords.push(savedKeyword);
      }

      // Commit the transaction
      await queryRunner.commitTransaction();

      return {
        video: savedVideo,
        transcripts: savedTranscripts,
        keywords: savedKeywords,
      };
    } catch (error) {
      // If there's an error, roll back the transaction
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Release the query runner
      await queryRunner.release();
    }
  }

  create(createDto: CreateVideoDto): Promise<Video> {
    return this.videoRepo.create(createDto);
  }

  getAll(query: GetVideoDto): Promise<GetAll<Video>> {
    return this.videoRepo.getAll(query);
  }

  getById(id: number, query: GetVideoDto): Promise<Video> {
    return this.videoRepo.getById(id, query);
  }

  update(id: number, updateDto: UpdateVideoDto): Promise<Video> {
    return this.videoRepo.update(id, updateDto);
  }

  delete(id: number): Promise<DeleteResult> {
    return this.videoRepo.delete(id);
  }
}
