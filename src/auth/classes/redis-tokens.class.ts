import { Injectable, UnauthorizedException } from "@nestjs/common";
import * as moment from 'moment';


import { createClient } from 'redis';

@Injectable()
export class RedisTokens {

    async storeUserToken(userId: number, cookie: string, token: string) {
        const expirationTime = moment().unix() + 1000 * 60 * 60;
        const client = createClient();
        await client.connect();
        await client.hSet(`user:${userId}:tokens`, cookie, token);
        await client.expire(`user:${userId}:tokens`, expirationTime);
    }

    async validateUserToken(userId: number, cookie: string, token: string) {
        const client = createClient();
        await client.connect();
        const storedToken = await client.hGet(`user:${userId}:tokens`, cookie);
        if (!storedToken || storedToken !== token) {
            throw new UnauthorizedException('token is invalid or expired');
        }
    }
}