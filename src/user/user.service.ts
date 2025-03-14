import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IRepository } from '../common/interfaces/repository.interfance.tsrepository.interfance';
import { User } from './entities/user.entity';
import { GetUserDto } from './dto/get-user.dto';
import { UserRepository } from './user.repository';
import { DeleteResult } from 'typeorm';
import { GetAll } from 'src/common/interfaces/get-all.interface';

@Injectable()
export class UserService implements IRepository<User, CreateUserDto, GetUserDto, UpdateUserDto> {
  constructor(private readonly userRepo: UserRepository) { }
  create(createDto: CreateUserDto): Promise<User> {
    return this.userRepo.create(createDto)
  }
  getAll(query: GetUserDto): Promise<GetAll<User>> {
    return this.userRepo.getAll(query)
  }
  getById(id: number, query: GetUserDto): Promise<User> {
    return this.userRepo.getById(id, query)
  }
  update(id: number, updateDto: UpdateUserDto): Promise<User> {
    return this.userRepo.update(id, updateDto)
  }
  delete(id: number): Promise<DeleteResult> {
    return this.userRepo.delete(id)
  }
}
