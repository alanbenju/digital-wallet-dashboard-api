/* eslint-disable @typescript-eslint/indent */
import { Wallet } from '../wallets/wallets.entity';
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    Index,
    OneToMany,
} from 'typeorm';

@Entity('User')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Index({ unique: true })
    username: string;

    @Column({ select: false })
    password: string;

    @OneToMany(() => Wallet, (wallet) => wallet.userId)
    wallets: Wallet[];
}
