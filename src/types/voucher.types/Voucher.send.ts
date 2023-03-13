import { IsUUID } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class VoucherInput {
    @Field()
    @IsUUID()
    voucherId: string;
}
