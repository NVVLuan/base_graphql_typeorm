import { IsInt, IsUUID, Max } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class InputVoucher {
    @Field()
    @IsUUID()
    event: string;

    @Field()
    @IsInt()
    @Max(10)
    quantity: number;
}
