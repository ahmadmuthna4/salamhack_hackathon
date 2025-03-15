
// get-user-progress.dto.ts
import { Type } from "class-transformer";
import { ArrayMaxSize, IsArray, IsEnum, IsOptional, IsString } from "class-validator";
import { OffsetLimitDto } from "../../common/dto/offset-limit.dto";

export enum UserProgressSelectedFieldEnum {
    user_id = 'user_id',
    xp_points = 'xp_points',
    level = 'level',
    createdAt = 'createdAt',
    updatedAt = 'updatedAt',
    deletedAt = 'deletedAt',
}

export class GetUserProgressDto extends OffsetLimitDto {
    @IsOptional()
    @IsArray()
    @Type(() => Array<string>)
    @IsString({ each: true })
    relations?: string[];

    @IsOptional()
    @IsArray()
    @ArrayMaxSize(Object.values(UserProgressSelectedFieldEnum).length)
    @IsEnum(UserProgressSelectedFieldEnum, {
        each: true,
        message: `Array values should be one of [${Object.values(
            UserProgressSelectedFieldEnum,
        ).join(', ')}]`,
    })
    select?: UserProgressSelectedFieldEnum[];
}
