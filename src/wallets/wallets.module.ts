import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '../auth/guards/jwt-guard';
import { WalletsController } from './wallets.controller';
import { WalletsService } from './wallets.service';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from './wallets.entity';
import { RatesModule } from '../rates/rates.module';

@Module({
    controllers: [WalletsController],
    imports: [HttpModule, TypeOrmModule.forFeature([Wallet]), RatesModule],
    providers: [
        WalletsService,
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
    ],
    exports: [WalletsService],
})
export class WalletsModule {}
