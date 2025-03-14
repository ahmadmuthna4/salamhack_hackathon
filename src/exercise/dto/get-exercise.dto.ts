
// get-exercise.dto.ts
import { Type } from "class-transformer";
import { ArrayMaxSize, IsArray, IsEnum, IsOptional, IsString } from "class-validator";
import { OffsetLimitDto } from "../../common/dto/offset-limit.dto";

export enum ExerciseSelectedFieldEnum {
    id = 'id',
    question = 'question',
    answer_choices = 'answer_choices',
    correct_answer = 'correct_answer',
    podcast_id = 'podcast_id',
    createdAt = 'createdAt',
    updatedAt = 'updatedAt',
    deletedAt = 'deletedAt',
}

export class GetExerciseDto extends OffsetLimitDto {
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
    @ArrayMaxSize(Object.values(ExerciseSelectedFieldEnum).length)
    @IsEnum(ExerciseSelectedFieldEnum, {
        each: true,
        message: `Array values should be one of [${Object.values(
            ExerciseSelectedFieldEnum,
        ).join(', ')}]`,
    })
    select?: ExerciseSelectedFieldEnum[];
}
