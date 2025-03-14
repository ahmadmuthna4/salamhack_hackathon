import { Type } from "class-transformer";
import { ArrayMaxSize, IsArray, IsEnum, IsOptional, IsString } from "class-validator";
import { OffsetLimitDto } from "../../common/dto/offset-limit.dto";

// get-transcript.dto.ts (continued)
export enum TranscriptSelectedFieldEnum {
    id = 'id',
    text = 'text',
    timestamp_start = 'timestamp_start',
    timestamp_end = 'timestamp_end',
    video_id = 'video_id',
    createdAt = 'createdAt',
    updatedAt = 'updatedAt',
    deletedAt = 'deletedAt',
}

export class GetTranscriptDto extends OffsetLimitDto {
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
    @ArrayMaxSize(Object.values(TranscriptSelectedFieldEnum).length)
    @IsEnum(TranscriptSelectedFieldEnum, {
        each: true,
        message: `Array values should be one of [${Object.values(
            TranscriptSelectedFieldEnum,
        ).join(', ')}]`,
    })
    select?: TranscriptSelectedFieldEnum[];
}
