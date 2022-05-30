import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RatesController } from './rates.controller';
import { Rate } from './rates.entity';
import { RatesService } from './rates.service';

@Module({
    imports: [TypeOrmModule.forFeature([Rate])],
    controllers: [RatesController],
    providers: [RatesService],
    exports: [RatesService],
})
export class RatesModule {}
