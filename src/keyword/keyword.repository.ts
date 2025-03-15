// keyword.repository.ts
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Keyword } from './entities/keyword.entity';
import { DeleteResult, ILike, Repository } from 'typeorm';
import { CreateKeywordDto } from './dto/create-keyword.dto';
import { IRepository } from '../common/interfaces/repository.interfance.tsrepository.interfance';
import { UpdateKeywordDto } from './dto/update-keyword.dto';
import { GetKeywordDto } from './dto/get-keyword.dto';
import { GetAll } from '../common/interfaces/get-all.interface';

@Injectable()
export class KeywordRepository
  implements
    IRepository<Keyword, CreateKeywordDto, GetKeywordDto, UpdateKeywordDto>
{
  constructor(
    @InjectRepository(Keyword) private keywordRepo: Repository<Keyword>,
  ) {}

  async create(createKeywordDto: CreateKeywordDto): Promise<Keyword> {
    const { keyword, user_level, video_id } = createKeywordDto;
    const keywordEntity = new Keyword();
    keywordEntity.keyword = keyword;
    keywordEntity.user_level = user_level ?? 1;
    keywordEntity.video_id = video_id;

    try {
      return await this.keywordRepo.save(keywordEntity);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getAll(query: GetKeywordDto): Promise<GetAll<Keyword>> {
    const { limit, offset, relations, search, select, user_level } = query;

    let whereConditions: any = {};

    if (search) {
      whereConditions.keyword = ILike(`%${search}%`);
    }

    if (user_level) {
      whereConditions.user_level = user_level;
    }

    const [array, count] = await this.keywordRepo.findAndCount({
      select: select ?? [],
      take: limit ?? 100,
      skip: offset ?? 0,
      relations: relations ?? [],
      order: { keyword: 'ASC' },
      where:
        Object.keys(whereConditions).length > 0 ? whereConditions : undefined,
    });

    return { count, array };
  }

  async getById(id: number, query: GetKeywordDto): Promise<Keyword> {
    const { relations, select } = query;
    const keyword = await this.keywordRepo.findOne({
      select: select ?? [],
      where: { id },
      relations,
    });
    if (!keyword) throw new NotFoundException('Keyword not found');
    return keyword;
  }

  async update(id: number, updateDto: UpdateKeywordDto): Promise<Keyword> {
    const keyword = await this.getById(id, {});
    const { keyword: keywordText, user_level } = updateDto;
    keyword.keyword = keywordText ?? keyword.keyword;
    keyword.user_level = user_level ?? keyword.user_level;
    return await this.keywordRepo.save(keyword);
  }

  async delete(id: number): Promise<DeleteResult> {
    const deleted = await this.keywordRepo.delete({ id });
    if (deleted.affected === 0)
      throw new NotFoundException('Keyword not found');
    return deleted;
  }

  async getByVideoId(
    videoId: number,
    query: GetKeywordDto,
  ): Promise<GetAll<Keyword>> {
    const { limit, offset, relations, select, user_level } = query;

    let whereConditions: any = {
      video_id: videoId,
    };

    if (user_level) {
      whereConditions.user_level = user_level;
    }

    const [array, count] = await this.keywordRepo.findAndCount({
      select: select ?? [],
      take: limit ?? 100,
      skip: offset ?? 0,
      relations: relations ?? [],
      where: whereConditions,
      order: { keyword: 'ASC' },
    });

    return { count, array };
  }
}
