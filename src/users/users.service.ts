import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, Repository } from 'typeorm';
import { SignupUserDto } from './users.dto';
import { User } from './users.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {}

    /**
     *
     * @param user User with already encrypted pass
     */
    async create(user: SignupUserDto): Promise<User> {
        return await this.usersRepository.save(user);
    }
    async findAll(): Promise<User[]> {
        return await this.usersRepository.find();
    }

    async findOne(id: number): Promise<User> {
        return await this.usersRepository.findOne(id);
    }

    async findOneByUsername(username: string): Promise<User> {
        return await this.usersRepository.findOne({ username });
    }

    async findOneFullByUsername(username: string): Promise<User> {
        return await getRepository(User)
            .createQueryBuilder('row')
            .select('row.id')
            .addSelect('row.username')
            .addSelect('row.password')
            .where('row.username = :username', { username: username })
            .getOne();
    }
}
