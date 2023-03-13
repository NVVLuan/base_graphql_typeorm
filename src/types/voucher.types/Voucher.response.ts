import { Voucher } from '../../entities/Voucher.entity';
import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class VoucherResponse {
    @Field()
    status: string;

    @Field({ nullable: true })
    message?: string;

    @Field({ nullable: true })
    voucher?: Voucher;
}
