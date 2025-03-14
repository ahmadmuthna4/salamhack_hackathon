// get-video.dto.ts
import { Type } from "class-transformer";
import { ArrayMaxSize, IsArray, IsEnum, IsOptional, IsString } from "class-validator";
import { OffsetLimitDto } from "../../common/dto/offset-limit.dto";

export enum VideoSelectedFieldEnum {
    id = 'id',
    youtube_url = 'youtube_url',
    title = 'title',
    image_path = 'image_path',
    processed = 'processed',
    user_id = 'user_id',
    createdAt = 'createdAt',
    updatedAt = 'updatedAt',
    deletedAt = 'deletedAt',
}

export class GetVideoDto extends OffsetLimitDto {
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
    @ArrayMaxSize(Object.values(VideoSelectedFieldEnum).length)
    @IsEnum(VideoSelectedFieldEnum, {
        each: true,
        message: `Array values should be one of [${Object.values(
            VideoSelectedFieldEnum,
        ).join(', ')}]`,
    })
    select?: VideoSelectedFieldEnum[];
}