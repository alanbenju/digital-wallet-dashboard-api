/* eslint-disable @typescript-eslint/indent */
import { IsNotEmpty } from 'class-validator';

export class CreateWalletDto {
    @IsNotEmpty()
    address: string;
    userId: number;
    firstTransactionDate: Date;
}

export class FindWalletsDTO {
    orderBy: string;
}

export class ListedWalletDto {
    address: string;
    userId: number;
    isOld: boolean;
    usdeth: number;
    eureth: number;
    eth: string;
    id: number;
    isFavorite: boolean;
    firstTransactionDate: Date;
}
