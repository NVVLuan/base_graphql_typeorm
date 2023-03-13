import { Field, Int, InputType } from 'type-graphql';
import { MaxLength, IsInt, IsEmail } from 'class-validator';

@InputType()
export class InputUser {
    @Field(() => String)
    @MaxLength(30)
    username: string;

    @Field(() => String)
    @MaxLength(30)
    password: string;

    @Field(() => Int, { nullable: true })
    @IsInt()
    age: number;

    @Field(() => String)
    @IsEmail()
    email: string;
}
