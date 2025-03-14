
// transcript.repository.ts
import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Transcript } from "./entities/transcript.entity";
import { DeleteResult, ILike, Repository } from "typeorm";
import { CreateTranscriptDto } from "./dto/create-transcript.dto";
import { IRepository } from "../common/interfaces/repository.interfance.tsrepository.interfance";
import { UpdateTranscriptDto } from "./dto/update-transcript.dto";
import { GetTranscriptDto } from "./dto/get-transcript.dto";
import { GetAll } from "../common/interfaces/get-all.interface";

@Injectable()
export class TranscriptRepository implements IRepository<Transcript, CreateTranscriptDto, GetTranscriptDto, UpdateTranscriptDto> {
    constructor(@InjectRepository(Transcript) private transcriptRepo: Repository<Transcript>) { }

    async create(createTranscriptDto: CreateTranscriptDto): Promise<Transcript> {
        const { text, timestamp_start, timestamp_end, video_id } = createTranscriptDto;
        const transcript = new Transcript();
        transcript.text = text;
        transcript.timestamp_start = timestamp_start;
        transcript.timestamp_end = timestamp_end;
        transcript.video_id = video_id;

        try {
            return await this.transcriptRepo.save(transcript);
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    async getAll(query: GetTranscriptDto): Promise<GetAll<Transcript>> {
        const { limit, offset, relations, search, select } = query;
        const [array, count] = await this.transcriptRepo.findAndCount({
            select: select ?? [],
            take: limit ?? 100,
            skip: offset ?? 0,
            relations: relations ?? [],
            order: { timestamp_start: 'ASC' },
            where: search ? [{
                text: search ? ILike(`%${search}%`) : null
            }] : undefined
        });
        return { count, array };
    }

    async getById(id: number, query: GetTranscriptDto): Promise<Transcript> {
        const { relations, select } = query;
        const transcript = await this.transcriptRepo.findOne({ select: select ?? [], where: { id }, relations });
        if (!transcript) throw new NotFoundException('Transcript not found');
        return transcript;
    }

    async update(id: number, updateDto: UpdateTranscriptDto): Promise<Transcript> {
        const transcript = await this.getById(id, {});
        const { text, timestamp_start, timestamp_end } = updateDto;
        transcript.text = text ?? transcript.text;
        transcript.timestamp_start = timestamp_start ?? transcript.timestamp_start;
        transcript.timestamp_end = timestamp_end ?? transcript.timestamp_end;
        return await this.transcriptRepo.save(transcript);
    }

    async delete(id: number): Promise<DeleteResult> {
        const deleted = await this.transcriptRepo.delete({ id });
        if (deleted.affected === 0) throw new NotFoundException('Transcript not found');
        return deleted;
    }

    async getByVideoId(videoId: number, query: GetTranscriptDto): Promise<GetAll<Transcript>> {
        const { limit, offset, relations, select } = query;
        const [array, count] = await this.transcriptRepo.findAndCount({
            select: select ?? [],
            take: limit ?? 100,
            skip: offset ?? 0,
            relations: relations ?? [],
            where: { video_id: videoId },
            order: { timestamp_start: 'ASC' }
        });
        return { count, array };
    }
}