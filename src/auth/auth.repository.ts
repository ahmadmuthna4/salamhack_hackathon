import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../user/entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class AuthRepository {
    constructor(@InjectRepository(User) private user: Repository<User>) { }
    async getUserByEmail(email: string): Promise<User> {
        const user = await this.user.findOne({ where: { email } });
        if (!user) throw new UnauthorizedException('email or user is not correct');
        return user;
    }

    async getUserById(id: number): Promise<User> {
        const user = await this.user.findOne({ where: { id } });
        if (!user) throw new UnauthorizedException('user not exists');
        return user;
    }
}