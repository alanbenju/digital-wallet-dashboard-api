/* eslint-disable @typescript-eslint/indent */
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Rate')
export class Rate {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    base: string;

    @Column()
    currency: string;

    @Column()
    value: number;
}
