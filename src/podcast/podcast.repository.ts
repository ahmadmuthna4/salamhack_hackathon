
// podcast.repository.ts
import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Podcast } from "./entities/podcast.entity";
import { DeleteResult, Repository } from "typeorm";
import { CreatePodcastDto } from "./dto/create-podcast.dto";
import { IRepository } from "../common/interfaces/repository.interfance.tsrepository.interfance";
import { UpdatePodcastDto } from "./dto/update-podcast.dto";
import { GetPodcastDto } from "./dto/get-podcast.dto";
import { GetAll } from "../common/interfaces/get-all.interface";

@Injectable()
export class PodcastRepository implements IRepository<Podcast, CreatePodcastDto, GetPodcastDto, UpdatePodcastDto> {
    constructor(@InjectRepository(Podcast) private podcastRepo: Repository<Podcast>) { }

    async create(createPodcastDto: CreatePodcastDto): Promise<Podcast> {
        const { video_id, transcript_id, ai_generated_text } = createPodcastDto;
        const podcast = new Podcast();
        podcast.video_id = video_id;
        podcast.transcript_id = transcript_id;
        podcast.ai_generated_text = ai_generated_text;

        try {
            return await this.podcastRepo.save(podcast);
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    async getAll(query: GetPodcastDto): Promise<GetAll<Podcast>> {
        const { limit, offset, relations, select } = query;
        const [array, count] = await this.podcastRepo.findAndCount({

            take: limit ?? 100,
            skip: offset ?? 0,
            relations: relations ?? [],
            order: { createdAt: 'DESC' }
        });
        return { count, array };
    }

    async getById(id: number, query: GetPodcastDto): Promise<Podcast> {
        const { relations, select } = query;
        const podcast = await this.podcastRepo.findOne({

            where: { id },
            relations: relations ?? []
        });
        if (!podcast) throw new NotFoundException('Podcast not found');
        return podcast;
    }

    async update(id: number, updateDto: UpdatePodcastDto): Promise<Podcast> {
        const podcast = await this.getById(id, {});
        const { video_id, transcript_id, ai_generated_text } = updateDto;

        podcast.video_id = video_id ?? podcast.video_id;
        podcast.transcript_id = transcript_id ?? podcast.transcript_id;
        podcast.ai_generated_text = ai_generated_text ?? podcast.ai_generated_text;

        return await this.podcastRepo.save(podcast);
    }

    async delete(id: number): Promise<DeleteResult> {
        const deleted = await this.podcastRepo.delete({ id });
        if (deleted.affected === 0) throw new NotFoundException('Podcast not found');
        return deleted;
    }

    async getByVideoId(videoId: number, query: GetPodcastDto): Promise<GetAll<Podcast>> {
        const { limit, offset, relations, select } = query;
        const [array, count] = await this.podcastRepo.findAndCount({

            take: limit ?? 100,
            skip: offset ?? 0,
            relations: relations ?? [],
            where: { video_id: videoId },
            order: { createdAt: 'DESC' }
        });
        return { count, array };
    }

    async getByTranscriptId(transcriptId: number, query: GetPodcastDto): Promise<GetAll<Podcast>> {
        const { limit, offset, relations, select } = query;
        const [array, count] = await this.podcastRepo.findAndCount({

            take: limit ?? 100,
            skip: offset ?? 0,
            relations: relations ?? [],
            where: { transcript_id: transcriptId },
            order: { createdAt: 'DESC' }
        });
        return { count, array };
    }
}
