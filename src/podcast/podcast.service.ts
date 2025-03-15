// podcast.service.ts
import { Injectable } from '@nestjs/common';
import { CreatePodcastDto } from './dto/create-podcast.dto';
import { UpdatePodcastDto } from './dto/update-podcast.dto';
import { IRepository } from '../common/interfaces/repository.interfance.tsrepository.interfance';
import { Podcast } from './entities/podcast.entity';
import { GetPodcastDto } from './dto/get-podcast.dto';
import { PodcastRepository } from './podcast.repository';
import { DeleteResult } from 'typeorm';
import { GetAll } from '../common/interfaces/get-all.interface';

@Injectable()
export class PodcastService
  implements
    IRepository<Podcast, CreatePodcastDto, GetPodcastDto, UpdatePodcastDto>
{
  constructor(private readonly podcastRepo: PodcastRepository) {}

  create(createDto: CreatePodcastDto): Promise<Podcast> {
    return this.podcastRepo.create(createDto);
  }

  getAll(query: GetPodcastDto): Promise<GetAll<Podcast>> {
    return this.podcastRepo.getAll(query);
  }

  getById(id: number, query: GetPodcastDto): Promise<Podcast> {
    return this.podcastRepo.getById(id, query);
  }

  update(id: number, updateDto: UpdatePodcastDto): Promise<Podcast> {
    return this.podcastRepo.update(id, updateDto);
  }

  delete(id: number): Promise<DeleteResult> {
    return this.podcastRepo.delete(id);
  }

  getByVideoId(
    videoId: number,
    query: GetPodcastDto,
  ): Promise<GetAll<Podcast>> {
    return this.podcastRepo.getByVideoId(videoId, query);
  }
}
