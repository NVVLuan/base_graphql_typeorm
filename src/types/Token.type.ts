import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class TokenObject {
    @Field(() => String)
    tokenType: string;

    @Field(() => String)
    accessToken: string;

    @Field(() => String)
    refeshToken: string;
}
