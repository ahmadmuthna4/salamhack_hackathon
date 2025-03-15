// keyword.service.ts
import { Injectable } from '@nestjs/common';
import { CreateKeywordDto } from './dto/create-keyword.dto';
import { UpdateKeywordDto } from './dto/update-keyword.dto';
import { IRepository } from '../common/interfaces/repository.interfance.tsrepository.interfance';
import { Keyword } from './entities/keyword.entity';
import { GetKeywordDto } from './dto/get-keyword.dto';
import { KeywordRepository } from './keyword.repository';
import { DeleteResult } from 'typeorm';
import { GetAll } from '../common/interfaces/get-all.interface';

@Injectable()
export class KeywordService
  implements
    IRepository<Keyword, CreateKeywordDto, GetKeywordDto, UpdateKeywordDto>
{
  constructor(private readonly keywordRepo: KeywordRepository) {}

  create(createDto: CreateKeywordDto): Promise<Keyword> {
    return this.keywordRepo.create(createDto);
  }

  getAll(query: GetKeywordDto): Promise<GetAll<Keyword>> {
    return this.keywordRepo.getAll(query);
  }

  getById(id: number, query: GetKeywordDto): Promise<Keyword> {
    return this.keywordRepo.getById(id, query);
  }

  update(id: number, updateDto: UpdateKeywordDto): Promise<Keyword> {
    return this.keywordRepo.update(id, updateDto);
  }

  delete(id: number): Promise<DeleteResult> {
    return this.keywordRepo.delete(id);
  }

  getByVideoId(
    videoId: number,
    query: GetKeywordDto,
  ): Promise<GetAll<Keyword>> {
    return this.keywordRepo.getByVideoId(videoId, query);
  }
}
