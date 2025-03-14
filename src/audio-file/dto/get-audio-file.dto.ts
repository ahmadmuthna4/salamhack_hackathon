
// get-audio-file.dto.ts
import { Type } from "class-transformer";
import { ArrayMaxSize, IsArray, IsEnum, IsOptional, IsString } from "class-validator";
import { OffsetLimitDto } from "../../common/dto/offset-limit.dto";

export enum AudioFileSelectedFieldEnum {
    id = 'id',
    file_path = 'file_path',
    created_at = 'created_at',
    podcast_id = 'podcast_id',
    createdAt = 'createdAt',
    updatedAt = 'updatedAt',
    deletedAt = 'deletedAt',
}

export class GetAudioFileDto extends OffsetLimitDto {
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
    @ArrayMaxSize(Object.values(AudioFileSelectedFieldEnum).length)
    @IsEnum(AudioFileSelectedFieldEnum, {
        each: true,
        message: `Array values should be one of [${Object.values(
            AudioFileSelectedFieldEnum,
        ).join(', ')}]`,
    })
    select?: AudioFileSelectedFieldEnum[];
}
