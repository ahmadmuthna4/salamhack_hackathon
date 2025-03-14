import { IsEmail, IsEnum, IsOptional, IsString } from "class-validator";
import { UserRoleEnum } from "./create-user.dto";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";


export class UpdateUserDto {

    @ApiProperty({
        description: 'The name of the user.',
        example: 'Ahmed'
    })
    @IsOptional()
    @ApiPropertyOptional()
    @IsString()
    name: string;

    @ApiProperty({
        description: 'The email of the user.',
        example: 'Ahmed@example.com'
    })
    @IsOptional()
    @ApiPropertyOptional()
    @IsEmail()
    email: string;


    @ApiProperty({
        description: 'The language_preference of the user.',
        example: 'en'
    })
    @IsOptional()
    @ApiPropertyOptional()
    @IsString()
    language_preference: string;

    @ApiPropertyOptional({
        description: 'The role of the user.',
        enum: UserRoleEnum,
        example: 'admin',
    })
    @IsOptional()
    @ApiPropertyOptional()
    @IsEnum(UserRoleEnum)
    role: UserRoleEnum;
}
