import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { SignupUserDto, DBUserDTO, UserDto } from '../users/users.dto';
import { JwtService } from '@nestjs/jwt';
import { LoggedUserDto } from './auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async validateUser(username: string, pass: string): Promise<UserDto> {
        const user = await this.usersService.findOneFullByUsername(username);
        const match = await bcrypt.compare(pass, user.password);
        if (user && match) {
            return {
                id: user.id,
                username: user.username,
            };
        }
        return null;
    }

    async encryptPassword(pass: string): Promise<string> {
        return await bcrypt.hash(pass, 10);
    }

    login(user: DBUserDTO): LoggedUserDto {
        const payload = { username: user.username, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async signup(user: SignupUserDto): Promise<LoggedUserDto> {
        user.password = await this.encryptPassword(user.password);
        const createdUser = await this.usersService.create(user);
        return this.login(createdUser);
    }
}
