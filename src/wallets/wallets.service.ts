import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWalletDto, FindWalletsDTO } from './wallet.dto';
import { Wallet } from './wallets.entity';
import { HttpService } from '@nestjs/axios';
import { Observable } from 'rxjs';
import { AxiosResponse } from 'axios';

@Injectable()
export class WalletsService {
    constructor(
        @InjectRepository(Wallet)
        private walletsRepository: Repository<Wallet>,
        private httpService: HttpService,
    ) {}

    async create(wallet: CreateWalletDto): Promise<Wallet> {
        return await this.walletsRepository.save(wallet);
    }
    async findAll(userId: number, query: FindWalletsDTO): Promise<Wallet[]> {
        const params = {
            userId,
        };
        if (query.orderBy) params['order'] = { [query.orderBy]: 'DESC' };
        return await this.walletsRepository.find(params);
    }

    async findOne(id: number): Promise<Wallet> {
        return await this.walletsRepository.findOne(id);
    }

    async toggleFavorite(userId: number, walletId: number) {
        const wallet = await this.walletsRepository.findOne(walletId);
        if (!wallet || wallet.userId != userId) throw new ForbiddenException();
        wallet.isFavorite = !wallet.isFavorite;
        return await this.walletsRepository.update(walletId, wallet);
    }

    getEtherBalance(address: string): Promise<any> {
        const result: Observable<AxiosResponse<any>> = this.httpService
            .get(`${process.env.ETHERSCAN_API_URL}/api?module=account&action=balance&address=${address}&tag=latest&apikey=${process.env.ETHERSCAN_API_KEY}
     `);
        return new Promise((resolve) => {
            return result.subscribe((response) => {
                resolve(response.data.result);
            });
        });
    }

    getEtherBalanceMultipleAddresses(addresses: Array<string>): Promise<any[]> {
        const result: Observable<AxiosResponse<any>> = this.httpService.get(`${
            process.env.ETHERSCAN_API_URL
        }/api?module=account&action=balancemulti&address=${addresses.toString()}&tag=latest&apikey=${
            process.env.ETHERSCAN_API_KEY
        }
     `);
        return new Promise((resolve) => {
            return result.subscribe((response) => {
                console.log(response);
                resolve(response.data.result);
            });
        });
    }

    getOldestTransaction(address: string): Promise<any> {
        const result: Observable<AxiosResponse<any>> = this.httpService.get(
            `${process.env.ETHERSCAN_API_URL}/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=1&sort=asc&apikey=${process.env.ETHERSCAN_API_KEY}`,
        );
        return new Promise((resolve) => {
            return result.subscribe((response) => {
                resolve(response.data.result[0]);
            });
        });
    }
}
