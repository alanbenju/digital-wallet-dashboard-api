import { HttpModule } from '@nestjs/axios';
import { Test } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { RatesModule } from '../rates/rates.module';
import { Rate } from '../rates/rates.entity';
import { WalletsController } from './wallets.controller';
import { Wallet } from './wallets.entity';
import { WalletsService } from './wallets.service';
import { CreateWalletDto, FindWalletsDTO } from './wallet.dto';
import { RatesService } from '../rates/rates.service';

describe('WalletsController', () => {
    let walletController: WalletsController;
    let walletsService: WalletsService;
    let ratesService: RatesService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            controllers: [WalletsController],
            imports: [
                HttpModule,
                RatesModule,
                TypeOrmModule.forFeature([Wallet]),
                TypeOrmModule.forFeature([Rate]),
            ],
            providers: [WalletsService],
        })
            .overrideProvider(getRepositoryToken(Wallet))
            .useValue({})
            .overrideProvider(getRepositoryToken(Rate))
            .useValue({})
            .compile();

        walletController = moduleRef.get<WalletsController>(WalletsController);
        walletsService = moduleRef.get<WalletsService>(WalletsService);
        ratesService = moduleRef.get<RatesService>(RatesService);
    });

    it('Create wallet for user should set firstTransactionDate', async () => {
        const req = { user: { id: 1 } };
        const body = { address: '0x123' } as CreateWalletDto;
        const oldestTransaction = { timeStamp: 1652926193 };
        const expected = {
            userId: 1,
            address: '0x123',
            firstTransactionDate: new Date(1652926193 * 1000),
        };
        jest.spyOn(walletsService, 'getOldestTransaction').mockImplementation(
            () => Promise.resolve(oldestTransaction),
        );
        const spyCreateWallet = jest
            .spyOn(walletsService, 'create')
            .mockImplementation(() => Promise.resolve({} as Wallet));
        await walletController.create(req, body);
        expect(spyCreateWallet).toBeCalledWith(expected);
    });

    it('Find logged user wallets with usd and eur rates from his/her eth balance', async () => {
        const req = { user: { id: 1 } };
        const date = new Date();
        date.setDate(date.getDate() - 1);
        date.setFullYear(date.getFullYear() - 1);
        const wallets: Array<Wallet> = [
            {
                address: '0x123',
                userId: 1,
                id: 1,
                isFavorite: true,
                firstTransactionDate: date,
            } as Wallet,
            {
                address: '0x124',
                userId: 1,
                id: 2,
                isFavorite: false,
                firstTransactionDate: new Date(),
            } as Wallet,
        ];
        const usdRate = { value: 1000 } as Rate;
        const eurRate = { value: 2000 } as Rate;
        const ethBalances = [
            { balance: '1000000000000000000' }, // 1 eth
            { balance: '2000000000000000000' }, // 2 eth
        ];

        jest.spyOn(walletsService, 'findAll').mockImplementation(() =>
            Promise.resolve(wallets),
        );
        jest.spyOn(ratesService, 'findOnePair').mockImplementationOnce(() =>
            Promise.resolve(usdRate),
        );
        jest.spyOn(ratesService, 'findOnePair').mockImplementationOnce(() =>
            Promise.resolve(eurRate),
        );
        jest.spyOn(
            walletsService,
            'getEtherBalanceMultipleAddresses',
        ).mockImplementationOnce(() => Promise.resolve(ethBalances));

        const expected = [
            { ...wallets[0], eth: '1.0', usdEth: 1000, eurEth: 2000 },
            { ...wallets[1], eth: '2.0', usdEth: 2000, eurEth: 4000 },
        ];

        const response = await walletController.findMyWallets(
            req,
            {} as FindWalletsDTO,
        );
        expect(response).toStrictEqual(expected);
    });

    it('Wallet should be old', () => {
        const wallet = new Wallet();
        const date = new Date();
        date.setDate(date.getDate() - 1);
        date.setFullYear(date.getFullYear() - 1);
        wallet.firstTransactionDate = date;
        wallet.setOld();
        expect(wallet.isOld).toBeTruthy();
    });

    it('Wallet should not be old', () => {
        const wallet = new Wallet();
        const date = new Date();
        wallet.firstTransactionDate = date;
        wallet.setOld();
        expect(wallet.isOld).toBeFalsy();
    });
});
