// audio-file.repository.ts
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AudioFile } from './entities/audio-file.entity';
import { DeleteResult, Repository } from 'typeorm';
import { CreateAudioFileDto } from './dto/create-audio-file.dto';
import { IRepository } from '../common/interfaces/repository.interfance.tsrepository.interfance';
import { UpdateAudioFileDto } from './dto/update-audio-file.dto';
import { GetAudioFileDto } from './dto/get-audio-file.dto';
import { GetAll } from '../common/interfaces/get-all.interface';
import { existsSync, unlinkSync } from 'fs';

@Injectable()
export class AudioFileRepository
  implements
    IRepository<
      AudioFile,
      CreateAudioFileDto,
      GetAudioFileDto,
      UpdateAudioFileDto
    >
{
  constructor(
    @InjectRepository(AudioFile) private audioFileRepo: Repository<AudioFile>,
  ) {}

  async create(createAudioFileDto: CreateAudioFileDto): Promise<AudioFile> {
    const { file_path, podcast_id } = createAudioFileDto;
    const audioFile = new AudioFile();
    audioFile.file_path = file_path;
    audioFile.podcast_id = podcast_id;

    try {
      return await this.audioFileRepo.save(audioFile);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getAll(query: GetAudioFileDto): Promise<GetAll<AudioFile>> {
    const { limit, offset, relations, select } = query;
    const [array, count] = await this.audioFileRepo.findAndCount({
      take: limit ?? 100,
      skip: offset ?? 0,
      relations: relations ?? [],
      order: { createdAt: 'DESC' },
    });
    return { count, array };
  }

  async getById(id: number, query: GetAudioFileDto): Promise<AudioFile> {
    const { relations, select } = query;
    const audioFile = await this.audioFileRepo.findOne({
      where: { id },
      relations,
    });
    if (!audioFile) throw new NotFoundException('Audio file not found');
    return audioFile;
  }

  async update(id: number, updateData: Partial<AudioFile>): Promise<AudioFile> {
    // First find the audio file
    const audioFile = await this.audioFileRepo.findOne({ where: { id } });

    if (!audioFile) {
      throw new NotFoundException(`Audio file with ID ${id} not found`);
    }

    // If we're updating the file, we should delete the old one
    if (updateData.file_path && audioFile.file_path) {
      try {
        // Remove the old file from the filesystem
        const oldFilePath = audioFile.file_path;
        if (existsSync(oldFilePath)) {
          unlinkSync(oldFilePath);
        }
      } catch (error) {
        // Log the error but don't stop the update process
        console.error('Error deleting old file:', error);
      }
    }

    // Update the entity
    Object.assign(audioFile, updateData);

    try {
      return await this.audioFileRepo.save(audioFile);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async delete(id: number): Promise<DeleteResult> {
    const deleted = await this.audioFileRepo.delete({ id });
    if (deleted.affected === 0)
      throw new NotFoundException('Audio file not found');
    return deleted;
  }

  async getByPodcastId(
    podcastId: number,
    query: GetAudioFileDto,
  ): Promise<GetAll<AudioFile>> {
    const { limit, offset, relations, select } = query;
    const [array, count] = await this.audioFileRepo.findAndCount({
      take: limit ?? 100,
      skip: offset ?? 0,
      relations: relations ?? [],
      where: { podcast_id: podcastId },
      order: { createdAt: 'DESC' },
    });
    return { count, array };
  }
}
