/* eslint-disable @typescript-eslint/indent */
import { IsNotEmpty } from 'class-validator';

export class RateDto {
    @IsNotEmpty()
    base: string;
    @IsNotEmpty()
    currency: string;
    @IsNotEmpty()
    value: number;
}

export class DBRateDto {
    base: string;
    currency: string;
    value: number;
    id: number;
}
