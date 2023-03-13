import { IsInt, MinLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class InputEvent {
    @Field()
    @MinLength(3)
    name_event: string;

    @Field()
    @IsInt()
    max_quantity: number;
}
