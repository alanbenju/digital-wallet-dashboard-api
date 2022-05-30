import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DBRateDto, RateDto } from './rates.dto';
import { Rate } from './rates.entity';

@Injectable()
export class RatesService {
    constructor(
        @InjectRepository(Rate)
        private RatesRepository: Repository<Rate>,
    ) { }

    async create(rate: RateDto): Promise<DBRateDto> {
        return await this.RatesRepository.save(rate);
    }

    async updateValue(id: number, value: number): Promise<DBRateDto> {
        const rate = await this.findOneById(id);
        rate.value = value;
        return await this.RatesRepository.save(rate);
    }

    async findAll(): Promise<DBRateDto[]> {
        return await this.RatesRepository.find();
    }

    async findOnePair(base: string, currency: string): Promise<DBRateDto>{
        return await this.RatesRepository.findOne({ base, currency });
    }

    async findOneById(id: number): Promise<DBRateDto> {
        return await this.RatesRepository.findOne({ id });
    }
}
