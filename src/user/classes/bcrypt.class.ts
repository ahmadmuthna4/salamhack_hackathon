import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";

@Injectable()
export class Bcrypt {
    isValidPassword(textPassword: string, hashedPassword: string) {
        return bcrypt.compareSync(textPassword, hashedPassword);
    }

    hashUserPassword(password: string): string {
        return bcrypt.hashSync(password, 8);
    }
}