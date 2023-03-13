import { Field, InputType } from 'type-graphql';
import { MaxLength } from 'class-validator';

@InputType()
export class LoginUser {
    @Field(() => String)
    @MaxLength(30)
    username: string;

    @Field(() => String)
    @MaxLength(30)
    password: string;
}
