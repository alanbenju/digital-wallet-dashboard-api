import { Body, Controller, Get, Param, Post, Put, Req } from '@nestjs/common';
import { DBRateDto, RateDto } from './rates.dto';
import { RatesService } from './rates.service';

@Controller('rates')
export class RatesController {
    constructor(private ratesService: RatesService) {}

    @Get()
    async findAll() {
        return await this.ratesService.findAll();
    }

    @Post()
    async create(@Req() req, @Body() rate: RateDto) {
        return await this.ratesService.create(rate);
    }

    @Put('/:id')
    async update(@Req() req, @Param() params, @Body() rate: DBRateDto) {
        console.log(params.id, rate.value)
        return await this.ratesService.updateValue(params.id, rate.value);
    }
}
