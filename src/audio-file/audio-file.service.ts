// audio-file.service.ts
import { Injectable } from '@nestjs/common';
import { CreateAudioFileDto } from './dto/create-audio-file.dto';
import { UpdateAudioFileDto } from './dto/update-audio-file.dto';
import { IRepository } from '../common/interfaces/repository.interfance.tsrepository.interfance';
import { AudioFile } from './entities/audio-file.entity';
import { GetAudioFileDto } from './dto/get-audio-file.dto';
import { AudioFileRepository } from './audio-file.repository';
import { DeleteResult } from 'typeorm';
import { GetAll } from '../common/interfaces/get-all.interface';

@Injectable()
export class AudioFileService
  implements
    IRepository<
      AudioFile,
      CreateAudioFileDto,
      GetAudioFileDto,
      UpdateAudioFileDto
    >
{
  constructor(private readonly audioFileRepo: AudioFileRepository) {}

  create(createDto: CreateAudioFileDto): Promise<AudioFile> {
    return this.audioFileRepo.create(createDto);
  }

  getAll(query: GetAudioFileDto): Promise<GetAll<AudioFile>> {
    return this.audioFileRepo.getAll(query);
  }

  getById(id: number, query: GetAudioFileDto): Promise<AudioFile> {
    return this.audioFileRepo.getById(id, query);
  }

  async update(id: number, updateData: Partial<AudioFile>): Promise<AudioFile> {
    return this.audioFileRepo.update(id, updateData);
  }

  delete(id: number): Promise<DeleteResult> {
    return this.audioFileRepo.delete(id);
  }

  getByPodcastId(
    podcastId: number,
    query: GetAudioFileDto,
  ): Promise<GetAll<AudioFile>> {
    return this.audioFileRepo.getByPodcastId(podcastId, query);
  }
}
