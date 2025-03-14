import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { DeleteResult, ILike, Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { IRepository } from "../common/interfaces/repository.interfance.tsrepository.interfance";
import { UpdateUserDto } from "./dto/update-user.dto";
import { GetUserDto } from "./dto/get-user.dto";
import { GetAll } from "../common/interfaces/get-all.interface";
import { Bcrypt } from "./classes/bcrypt.class";

@Injectable()
export class UserRepository implements IRepository<User, CreateUserDto, GetUserDto, UpdateUserDto> {
    constructor(@InjectRepository(User) private user: Repository<User>, private bcrypt: Bcrypt) { }

    async create(createUserDto: CreateUserDto): Promise<User> {
        const { email, name, password, role, language_preference } = createUserDto;
        const user = new User();
        user.email = email;
        user.name = name;
        user.role = role;
        user.language_preference = language_preference;
        user.password = this.bcrypt.hashUserPassword(password)
        try {
            return await this.user.save(user);
        } catch (error) {
            if (error.code === '23505')
                throw new ConflictException('Email already exists');
            throw new InternalServerErrorException(error.message);
        }
    }

    async getAll(query: GetUserDto): Promise<GetAll<User>> {

        const { limit, offset, relations, search, select } = query;
        const [array, count] = await this.user.findAndCount({
            select: select ?? [],
            take: limit ?? 100,
            skip: offset ?? 0,
            relations: relations ?? [],
            order: { createdAt: 'ASC' },
            where: search ? [{
                name: search ? ILike(`%${search}%`) : null
            }, {
                email: search ? ILike(`%${search}%`) : null
            }] : undefined
        })
        return { count, array };
    }


    async getById(id: number, query: GetUserDto): Promise<User> {
        const { relations, select } = query;
        const user = await this.user.findOne({ select: select ?? [], where: { id }, relations });
        if (!user) throw new NotFoundException('User not found');
        return user;
    }

    async update(id: number, updateDto: UpdateUserDto): Promise<User> {
        const user = await this.getById(id, {})
        const { name, email, role, language_preference } = updateDto;
        user.name = name ?? user.name;
        user.email = email ?? user.email;
        user.role = role ?? user.role;
        user.language_preference = language_preference ?? user.language_preference;
        return await this.user.save(user);
    }

    async delete(id: number): Promise<DeleteResult> {
        const deleted = await this.user.delete({ id });
        if (deleted.affected === 0) throw new NotFoundException('user not found');
        return deleted
    }
}