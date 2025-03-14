import { Type } from "class-transformer";
import { ArrayMaxSize, IsArray, IsEnum, IsOptional, IsString } from "class-validator";
import { OffsetLimitDto } from "../../common/dto/offset-limit.dto";

export enum UserSelectedFieldEnum {
    id = 'id',
    name = "name",
    email = "email",
    role = "role",
    language_preference = "language_preference",
    createdAt = "createdAt",
    updatedAt = "updatedAt",
    deletedAt = "deletedAt",
}

export class GetUserDto extends OffsetLimitDto {
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
    @ArrayMaxSize(Object.values(UserSelectedFieldEnum).length)
    @IsEnum(UserSelectedFieldEnum, {
        each: true,
        message: ` Array values should be one of [${Object.values(
            UserSelectedFieldEnum,
        ).join(', ')}]`,
    })
    select?: UserSelectedFieldEnum[];
}