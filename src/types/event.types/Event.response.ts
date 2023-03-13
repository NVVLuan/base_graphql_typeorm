import { Event } from '../../entities/Event.entity';
import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class EventResponse {
    @Field()
    status: string;

    @Field({ nullable: true })
    message: string;

    @Field(() => [Event], { nullable: true })
    event: Event[];

    constructor(status: string, message?: string, event?: Event[]) {
        this.status = status;
        this.message = message;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        this.event = event;
    }

    getAll(): Partial<EventResponse> {
        return {
            status: this.status,
            message: this.message,
            event: this.event,
        };
    }
}
