import { User } from './User.entity';
import { Field, ObjectType } from 'type-graphql';
import {
    BaseEntity,
    Column,
    Entity,
    Index,
    JoinTable,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Event } from './Event.entity';

export enum Status {
    SEND = 'send',
    ACTIVE = 'active',
    NON_ACTIVE = 'not_active',
}
@Entity()
@ObjectType()
export class Voucher extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    @Field()
    id: string;

    @Column()
    @Field()
    code: string;

    @Column({
        type: 'enum',
        enum: Status,
        default: Status.NON_ACTIVE,
    })
    @Field()
    status: Status;

    @ManyToOne(() => Event, event => event.vouchers)
    @JoinTable()
    @Field(() => Event)
    @Index()
    event: Event;

    @ManyToOne(() => User, user => user.vouchers)
    @JoinTable()
    @Field(() => User)
    user: User;
}
