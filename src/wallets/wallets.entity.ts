/* eslint-disable @typescript-eslint/indent */
import { User } from '../users/users.entity';
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    Index,
    ManyToOne,
    AfterLoad,
    BeforeInsert,
    BeforeUpdate,
} from 'typeorm';

@Entity('Wallet')
export class Wallet {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Index({ unique: true })
    address: string;

    @Column()
    firstTransactionDate: Date;

    @Column({ default: false })
    isFavorite: boolean;

    @ManyToOne(() => User, (user) => user.wallets)
    @Column()
    userId: number;

    isOld: boolean;

    @AfterLoad()
    setOld() {
        this.isOld =
            (new Date().valueOf() - this.firstTransactionDate.valueOf()) /
                (1000 * 3600 * 24 * 365) >
            1;
    }

    @BeforeUpdate()
    removeProperties() {
        delete this.isOld;
    }
}
