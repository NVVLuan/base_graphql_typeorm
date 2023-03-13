import { Field, ID, Int, InputType } from 'type-graphql';
import { MaxLength, IsInt } from 'class-validator';

@InputType()
export class UpdateUser {
    @Field(() => ID)
    @MaxLength(30)
    id: string;

    @Field(() => String, { nullable: true })
    @MaxLength(30)
    password?: string;

    @Field(() => Int, { nullable: true })
    @IsInt()
    age?: number;

    @Field(() => String, { nullable: true })
    @MaxLength(30)
    email?: string;
}
