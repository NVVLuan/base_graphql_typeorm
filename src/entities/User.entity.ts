import { Voucher } from './Voucher.entity';
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany } from 'typeorm';
import { ObjectType, Field, ID, Int, Authorized } from 'type-graphql';

export enum UserRole {
    ADMIN = 'admin',
    GHOST = 'ghost',
}

@Entity()
@ObjectType()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    @Field(() => ID)
    id: string;

    @Column()
    @Field(() => String)
    username: string;

    @Column()
    @Authorized(['admin'])
    @Field(() => String)
    password: string;

    @Column()
    @Field(() => Int)
    age: number;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.GHOST,
    })
    role: UserRole;

    @Column()
    @Field(() => String)
    email: string;

    @OneToMany(() => Voucher, voucher => voucher.user)
    @Field(() => [Voucher])
    vouchers: Promise<Voucher[]>;
}
