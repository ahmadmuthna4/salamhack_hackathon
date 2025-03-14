// transcript.service.ts
import { Injectable } from '@nestjs/common';
import { CreateTranscriptDto } from './dto/create-transcript.dto';
import { UpdateTranscriptDto } from './dto/update-transcript.dto';
import { IRepository } from '../common/interfaces/repository.interfance.tsrepository.interfance';
import { Transcript } from './entities/transcript.entity';
import { GetTranscriptDto } from './dto/get-transcript.dto';
import { TranscriptRepository } from './transcript.repository';
import { DeleteResult } from 'typeorm';
import { GetAll } from '../common/interfaces/get-all.interface';

@Injectable()
export class TranscriptService implements IRepository<Transcript, CreateTranscriptDto, GetTranscriptDto, UpdateTranscriptDto> {
  constructor(private readonly transcriptRepo: TranscriptRepository) { }

  create(createDto: CreateTranscriptDto): Promise<Transcript> {
    return this.transcriptRepo.create(createDto);
  }

  getAll(query: GetTranscriptDto): Promise<GetAll<Transcript>> {
    return this.transcriptRepo.getAll(query);
  }

  getById(id: number, query: GetTranscriptDto): Promise<Transcript> {
    return this.transcriptRepo.getById(id, query);
  }

  update(id: number, updateDto: UpdateTranscriptDto): Promise<Transcript> {
    return this.transcriptRepo.update(id, updateDto);
  }

  delete(id: number): Promise<DeleteResult> {
    return this.transcriptRepo.delete(id);
  }

  getByVideoId(videoId: number, query: GetTranscriptDto): Promise<GetAll<Transcript>> {
    return this.transcriptRepo.getByVideoId(videoId, query);
  }
}
