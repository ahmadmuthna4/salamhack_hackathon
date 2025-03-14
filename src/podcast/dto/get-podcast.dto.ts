
// get-podcast.dto.ts
import { Type } from "class-transformer";
import { ArrayMaxSize, IsArray, IsEnum, IsOptional, IsString } from "class-validator";
import { OffsetLimitDto } from "../../common/dto/offset-limit.dto";

export enum PodcastSelectedFieldEnum {
    id = 'id',
    video_id = 'video_id',
    transcript_id = 'transcript_id',
    ai_generated_text = 'ai_generated_text',
    created_at = 'created_at',
    createdAt = 'createdAt',
    updatedAt = 'updatedAt',
    deletedAt = 'deletedAt',
}

export class GetPodcastDto extends OffsetLimitDto {
    @IsOptional()
    @IsArray()
    @Type(() => Array<string>)
    @IsString({ each: true })
    relations?: string[];

    @IsOptional()
    @IsString()
    @Type(() => String)
    search?: string;

    @IsOptional()
    @IsArray()
    @ArrayMaxSize(Object.values(PodcastSelectedFieldEnum).length)
    @IsEnum(PodcastSelectedFieldEnum, {
        each: true,
        message: `Array values should be one of [${Object.values(
            PodcastSelectedFieldEnum,
        ).join(', ')}]`,
    })
    select?: PodcastSelectedFieldEnum[];
}
