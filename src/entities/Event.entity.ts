import { User } from './User.entity';
import { IsUUID } from 'class-validator';
import { Field, ObjectType } from 'type-graphql';
import {
    Entity,
    Column,
    OneToMany,
    BaseEntity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Voucher } from './Voucher.entity';

@Entity()
@ObjectType()
export class Event extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    @Field()
    id: string;

    @Column()
    @Field()
    name_event: string;

    @Column()
    @Field()
    @IsUUID()
    issued: number;

    @Column({ default: null })
    @Field()
    @IsUUID()
    edit_by: string;

    @Column()
    @Field()
    max_quantity: number;

    @ManyToOne(() => User, user => user.id)
    @Field(() => [User])
    @JoinColumn()
    user: User;

    @OneToMany(() => Voucher, voucher => voucher.event)
    @Field(() => [Voucher])
    vouchers: Promise<Voucher[]>;

    @CreateDateColumn()
    @Field()
    createAt: Date;

    @UpdateDateColumn()
    @Field()
    updateAt: Date;
}
