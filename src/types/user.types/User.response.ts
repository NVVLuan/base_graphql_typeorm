import { User } from '../../entities/User.entity';
import { Field, ObjectType } from 'type-graphql';
import { TokenObject } from '../Token.type';

@ObjectType()
export class UserResponse {
    @Field()
    status: string;

    @Field({ nullable: true })
    message: string;

    @Field(() => [User], { nullable: true })
    user: User[];

    @Field({ nullable: true })
    token: TokenObject;

    constructor(status: string, message?: string, user?: User[], token?: TokenObject) {
        this.status = status;
        this.message = message;
        this.user = user;
        this.token = token;
    }

    get(): Partial<UserResponse> {
        return { status: this.status, message: this.message, user: this.user, token: this.token };
    }
}
