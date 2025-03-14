
// video.repository.ts
import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Video } from "./entities/video.entity";
import { DeleteResult, ILike, Repository } from "typeorm";
import { CreateVideoDto } from "./dto/create-video.dto";
import { IRepository } from "../common/interfaces/repository.interfance.tsrepository.interfance";
import { UpdateVideoDto } from "./dto/update-video.dto";
import { GetVideoDto } from "./dto/get-video.dto";
import { GetAll } from "../common/interfaces/get-all.interface";

@Injectable()
export class VideoRepository implements IRepository<Video, CreateVideoDto, GetVideoDto, UpdateVideoDto> {
    constructor(@InjectRepository(Video) private videoRepo: Repository<Video>) { }

    async create(createVideoDto: CreateVideoDto): Promise<Video> {
        const { youtube_url, title, image_path, processed, user_id } = createVideoDto;
        const video = new Video();
        video.youtube_url = youtube_url;
        video.title = title;
        video.image_path = image_path;
        video.processed = processed !== undefined ? processed : false;
        video.user_id = user_id;

        try {
            return await this.videoRepo.save(video);
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    async getAll(query: GetVideoDto): Promise<GetAll<Video>> {
        const { limit, offset, relations, search, select } = query;
        const [array, count] = await this.videoRepo.findAndCount({
            select: select ?? [],
            take: limit ?? 100,
            skip: offset ?? 0,
            relations: relations ?? [],
            order: { createdAt: 'ASC' },
            where: search ? [{
                title: search ? ILike(`%${search}%`) : null
            }] : undefined
        });
        return { count, array };
    }

    async getById(id: number, query: GetVideoDto): Promise<Video> {
        const { relations, select } = query;
        const video = await this.videoRepo.findOne({ select: select ?? [], where: { id }, relations });
        if (!video) throw new NotFoundException('Video not found');
        return video;
    }

    async update(id: number, updateDto: UpdateVideoDto): Promise<Video> {
        const video = await this.getById(id, {});
        const { youtube_url, title, image_path, processed } = updateDto;
        video.youtube_url = youtube_url ?? video.youtube_url;
        video.title = title ?? video.title;
        video.image_path = image_path ?? video.image_path;
        video.processed = processed ?? video.processed;
        return await this.videoRepo.save(video);
    }

    async delete(id: number): Promise<DeleteResult> {
        const deleted = await this.videoRepo.delete({ id });
        if (deleted.affected === 0) throw new NotFoundException('Video not found');
        return deleted;
    }
}