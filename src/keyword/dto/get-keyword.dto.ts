
// get-keyword.dto.ts
import { Type } from "class-transformer";
import { ArrayMaxSize, IsArray, IsEnum, IsInt, IsOptional, IsString, Max, Min } from "class-validator";
import { OffsetLimitDto } from "../../common/dto/offset-limit.dto";

export enum KeywordSelectedFieldEnum {
    id = 'id',
    keyword = 'keyword',
    user_level = 'user_level',
    transcript_id = 'transcript_id',
    createdAt = 'createdAt',
    updatedAt = 'updatedAt',
    deletedAt = 'deletedAt',
}

export class GetKeywordDto extends OffsetLimitDto {
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
    @IsInt()
    @Min(1)
    @Max(3)
    @Type(() => Number)
    user_level?: number;

    @IsOptional()
    @IsArray()
    @ArrayMaxSize(Object.values(KeywordSelectedFieldEnum).length)
    @IsEnum(KeywordSelectedFieldEnum, {
        each: true,
        message: `Array values should be one of [${Object.values(
            KeywordSelectedFieldEnum,
        ).join(', ')}]`,
    })
    select?: KeywordSelectedFieldEnum[];
}