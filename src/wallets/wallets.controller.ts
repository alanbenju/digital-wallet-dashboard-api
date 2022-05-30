/* eslint-disable @typescript-eslint/indent */
import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Put,
    Query,
    Req,
} from '@nestjs/common';
import { RatesService } from '../rates/rates.service';
import { CreateWalletDto, FindWalletsDTO, ListedWalletDto } from './wallet.dto';
import { WalletsService } from './wallets.service';
import { formatUnits } from 'nestjs-ethers';

@Controller('wallets')
export class WalletsController {
    constructor(
        private walletsService: WalletsService,
        private rateService: RatesService,
    ) {}

    @Get()
    async findMyWallets(
        @Req() req,
        @Query() query: FindWalletsDTO,
    ): Promise<ListedWalletDto[]> {
        const user = req.user;
        const wallets = await this.walletsService.findAll(user.id, query);
        const USDETHRate = await this.rateService.findOnePair('USD', 'ETH');
        const EURETHRate = await this.rateService.findOnePair('EUR', 'ETH');
        const ethBalances =
            await this.walletsService.getEtherBalanceMultipleAddresses(
                wallets.map((wallet) => wallet.address),
            );

        /*
                Doing it like this to solve the requirement that i have today
                If we had different bases (usd, eur, ars) and currencies (eth, btc) i would:
                - Find rates grouped by base
                - Have a strategy for each currency to :
                    - Get balance from wallet
                    - Format unit and calculate rate based on rate.base
                return a json on each wallet with rate.base as the key and an array with rate.currency and it's value
                The response format could differ depending on what we show on the clients
        */

        return wallets.map((wallet, index) => {
            return {
                ...wallet,
                eth: formatUnits(ethBalances[index].balance, 'ether'),
                usdeth:
                    Number(formatUnits(ethBalances[index].balance, 'ether')) *
                    USDETHRate.value,
                eureth:
                    Number(formatUnits(ethBalances[index].balance, 'ether')) *
                    EURETHRate.value,
            };
        });
    }

    @Post()
    async create(@Req() req, @Body() walletToCreate: CreateWalletDto) {
        walletToCreate.userId = req.user.id;
        const oldestTransaction =
            await this.walletsService.getOldestTransaction(
                walletToCreate.address,
            );
        walletToCreate.firstTransactionDate = new Date(
            oldestTransaction.timeStamp * 1000,
        );
        return await this.walletsService.create(walletToCreate);
    }

    @Put('favorite/:id')
    async toggleFavorite(@Req() req, @Param() params) {
        return await this.walletsService.toggleFavorite(req.user.id, params.id);
    }
}
