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
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import { Podcast } from 'src/podcast/entities/podcast.entity';

@Injectable()
export class VideoService
  implements IRepository<Video, CreateVideoDto, GetVideoDto, UpdateVideoDto>
{
  private readonly apiKey: string;
  private readonly apiUrl: string;
  constructor(
    private readonly videoRepo: VideoRepository,

    @InjectRepository(Transcript)
    private readonly transcriptsRepository: Repository<Transcript>,
    @InjectRepository(Keyword)
    private readonly keywordsRepository: Repository<Keyword>,
    private dataSource: DataSource,
    @InjectRepository(Podcast)
    private readonly podcastRepository: Repository<Podcast>,
  ) {
    // this.apiKey = this.configService.get<string>('AI_API_KEY');
    // this.apiUrl = this.configService.get<string>('AI_API_URL', 'https://api.openai.com/v1/chat/completions');
  }

  async makeRequest(url) {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `http://localhost:3000/scrape?url=${url}`,
      headers: {},
    };
    try {
      const response = await axios.request(config);
      // console.log(JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async createVideoWithRelated2(
    dto: CreateVideoWithRelatedDto,
    userId: number,
  ) {
    let scrape_youtube_data = await this.makeRequest(dto.url);
    const scrapeDataPath = path.join(__dirname, 'scrapeData.json');
    fs.writeFileSync(
      scrapeDataPath,
      JSON.stringify(scrape_youtube_data, null, 2),
    );
    if (scrape_youtube_data?.accessibility?.captions?.data?.length == 0) {
      throw new BadRequestException('No captions found for this video');
    }
    const transcripts = scrape_youtube_data.accessibility.captions.data;
    const video_info = {
      youtube_url: dto.url,
      title: scrape_youtube_data.video_info.title,
      image_path: scrape_youtube_data.video_info.thumbnails['168x94'],
    };

    // Start a transaction to ensure data consistency
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Create the video
      const video = await this.videoRepo.create({
        ...video_info,
        user_id: userId,
      });

      const savedVideo = await queryRunner.manager.save(Video, video);

      // Create and save all transcripts
      const savedTranscripts = [];
      for (const transcriptDto of transcripts) {
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

  ////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////
  async createVideoWithRelated(dto: CreateVideoWithRelatedDto, userId: number) {
    let scrape_youtube_data = await this.makeRequest(dto.url);
    const scrapeDataPath = path.join(__dirname, 'scrapeData.json');
    fs.writeFileSync(
      scrapeDataPath,
      JSON.stringify(scrape_youtube_data, null, 2),
    );

    if (scrape_youtube_data?.accessibility?.captions?.data?.length == 0) {
      throw new BadRequestException('No captions found for this video');
    }

    const transcripts = scrape_youtube_data.accessibility.captions.data;
    const video_info = {
      youtube_url: dto.url,
      title: scrape_youtube_data.video_info.title,
      image_path: scrape_youtube_data.video_info.thumbnails['168x94'],
    };

    // Start a transaction to ensure data consistency
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Create the video
      const video = await this.videoRepo.create({
        ...video_info,
        user_id: userId,
      });
      const savedVideo = await queryRunner.manager.save(Video, video);

      // Create and save all transcripts
      const savedTranscripts = [];
      for (const transcriptDto of transcripts) {
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

      // Generate AI text for podcast based on transcripts and keywords
      const aiGeneratedText = await this.mergeTranscriptText(
        savedTranscripts,
        // savedKeywords,
      );

      // Create podcast entity
      const podcast = this.podcastRepository.create({
        video: savedVideo,
        video_id: savedVideo.id,
        ai_generated_text: aiGeneratedText,
      });

      // Save podcast
      const savedPodcast = await queryRunner.manager.save(Podcast, podcast);

      // Commit the transaction
      await queryRunner.commitTransaction();

      return {
        video: savedVideo,
        transcripts: savedTranscripts,
        keywords: savedKeywords,
        podcast: savedPodcast,
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

  /**
   * Generate AI text for podcast based on transcripts and keywords
   */
  async mergeTranscriptText(transcripts) {
    return transcripts.map((segment) => segment.text).join(' ');
  }

  ////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////

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
