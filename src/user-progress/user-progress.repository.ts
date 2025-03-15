
// user-progress.repository.ts
import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserProgress } from "./entities/user-progress.entity";
import { DeleteResult, Repository } from "typeorm";
import { CreateUserProgressDto } from "./dto/create-user-progress.dto";
import { UpdateUserProgressDto } from "./dto/update-user-progress.dto";
import { GetUserProgressDto } from "./dto/get-user-progress.dto";
import { GetAll } from "../common/interfaces/get-all.interface";

@Injectable()
export class UserProgressRepository {
    constructor(
        @InjectRepository(UserProgress)
        private userProgressRepo: Repository<UserProgress>
    ) { }

    async create(createDto: CreateUserProgressDto): Promise<UserProgress> {
        const { user_id, xp_points, level } = createDto;

        // Check if the user progress already exists
        const existingProgress = await this.userProgressRepo.findOne({
            where: { user_id }
        });

        if (existingProgress) {
            // If it exists, update it instead
            return this.update(user_id, {
                xp_points,
                level
            });
        }

        const userProgress = new UserProgress();
        userProgress.user_id = user_id;

        if (xp_points !== undefined) {
            userProgress.xp_points = xp_points;
        }

        if (level !== undefined) {
            userProgress.level = level;
        }

        try {
            return await this.userProgressRepo.save(userProgress);
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    async getAll(query: GetUserProgressDto): Promise<GetAll<UserProgress>> {
        const { limit, offset, relations, select } = query;
        const [array, count] = await this.userProgressRepo.findAndCount({
            select: select ?? [],
            take: limit ?? 100,
            skip: offset ?? 0,
            relations: relations ?? []
        });
        return { count, array };
    }

    async getByUserId(userId: number, query: GetUserProgressDto): Promise<UserProgress> {
        const { relations, select } = query;
        const userProgress = await this.userProgressRepo.findOne({
            select: select ?? [],
            where: { user_id: userId },
            relations: relations ?? []
        });

        if (!userProgress) {
            throw new NotFoundException(`User progress for user ID ${userId} not found`);
        }

        return userProgress;
    }

    async update(userId: number, updateDto: UpdateUserProgressDto): Promise<UserProgress> {
        let userProgress: UserProgress;

        try {
            userProgress = await this.getByUserId(userId, {});
        } catch (error) {
            if (error instanceof NotFoundException) {
                // If user progress doesn't exist yet, create with defaults and then update
                const newProgress = new UserProgress();
                newProgress.user_id = userId;
                userProgress = await this.userProgressRepo.save(newProgress);
            } else {
                throw error;
            }
        }

        const { xp_points, level } = updateDto;

        if (xp_points !== undefined) {
            userProgress.xp_points = xp_points;
        }

        if (level !== undefined) {
            userProgress.level = level;
        }

        return await this.userProgressRepo.save(userProgress);
    }

    async addXpPoints(userId: number, xpToAdd: number): Promise<UserProgress> {
        let userProgress: UserProgress;

        try {
            userProgress = await this.getByUserId(userId, {});
        } catch (error) {
            if (error instanceof NotFoundException) {
                // If user progress doesn't exist yet, create with defaults
                const newProgress = new UserProgress();
                newProgress.user_id = userId;
                userProgress = await this.userProgressRepo.save(newProgress);
            } else {
                throw error;
            }
        }

        // Add XP points
        userProgress.xp_points += xpToAdd;

        // Check if user should level up (simple example logic - can be customized)
        // Formula: level = floor(1 + sqrt(xp_points / 100))
        const newLevel = Math.floor(1 + Math.sqrt(userProgress.xp_points / 100));
        if (newLevel > userProgress.level) {
            userProgress.level = newLevel;
        }

        return await this.userProgressRepo.save(userProgress);
    }

    async delete(userId: number): Promise<DeleteResult> {
        const deleted = await this.userProgressRepo.delete({ user_id: userId });
        if (deleted.affected === 0) {
            throw new NotFoundException(`User progress for user ID ${userId} not found`);
        }
        return deleted;
    }
}