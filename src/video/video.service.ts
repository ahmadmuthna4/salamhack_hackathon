
// video.service.ts
import { Injectable } from '@nestjs/common';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { IRepository } from '../common/interfaces/repository.interfance.tsrepository.interfance';
import { Video } from './entities/video.entity';
import { GetVideoDto } from './dto/get-video.dto';
import { VideoRepository } from './video.repository';
import { DeleteResult } from 'typeorm';
import { GetAll } from '../common/interfaces/get-all.interface';

@Injectable()
export class VideoService implements IRepository<Video, CreateVideoDto, GetVideoDto, UpdateVideoDto> {
  constructor(private readonly videoRepo: VideoRepository) { }

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
