/* eslint-disable @typescript-eslint/indent */
import { IsNotEmpty } from 'class-validator';

export class SignupUserDto {
    @IsNotEmpty()
    username: string;
    @IsNotEmpty()
    password: string;
}

export class DBUserDTO {
    username: string;
    password: string;
    id: number;
}

export class UserDto {
    username: string;
    id: number;
}
