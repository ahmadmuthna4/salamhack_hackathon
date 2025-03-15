
// user-progress.service.ts
import { Injectable } from '@nestjs/common';
import { CreateUserProgressDto } from './dto/create-user-progress.dto';
import { UpdateUserProgressDto } from './dto/update-user-progress.dto';
import { UserProgress } from './entities/user-progress.entity';
import { GetUserProgressDto } from './dto/get-user-progress.dto';
import { UserProgressRepository } from './user-progress.repository';
import { DeleteResult } from 'typeorm';
import { GetAll } from '../common/interfaces/get-all.interface';

@Injectable()
export class UserProgressService {
  constructor(private readonly userProgressRepo: UserProgressRepository) { }

  create(createDto: CreateUserProgressDto): Promise<UserProgress> {
    return this.userProgressRepo.create(createDto);
  }

  getAll(query: GetUserProgressDto): Promise<GetAll<UserProgress>> {
    return this.userProgressRepo.getAll(query);
  }

  getByUserId(userId: number, query: GetUserProgressDto): Promise<UserProgress> {
    return this.userProgressRepo.getByUserId(userId, query);
  }

  update(userId: number, updateDto: UpdateUserProgressDto): Promise<UserProgress> {
    return this.userProgressRepo.update(userId, updateDto);
  }

  addXpPoints(userId: number, xpToAdd: number): Promise<UserProgress> {
    return this.userProgressRepo.addXpPoints(userId, xpToAdd);
  }

  delete(userId: number): Promise<DeleteResult> {
    return this.userProgressRepo.delete(userId);
  }
}
