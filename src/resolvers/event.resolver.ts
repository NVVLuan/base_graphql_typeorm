import { Arg, Authorized, Ctx, Mutation, Resolver } from 'type-graphql';
import { Brackets } from 'typeorm';
import { AppDataSource } from '../configs/database.config';
import { Event } from '../entities/Event.entity';
import { ResponeRequest } from '../middlewares/checkAuth';
import { InputEvent } from '../types/event.types/event.input';
import { EventResponse } from '../types/event.types/Event.response';
import { Context } from './../types/Icontext.type';
import { ApolloServerError } from './../utils/Errors/query_error';
@Resolver()
export class EventResolver {
    //create new event
    @Mutation(() => EventResponse)
    async createEvent(@Arg('input') eventInput: InputEvent): Promise<Partial<EventResponse>> {
        const checkEvent = await Event.findOne({ where: { name_event: eventInput.name_event } });
        if (checkEvent) return new EventResponse('error', 'event exit').getAll();

        return new EventResponse('success', 'created', [
            await Event.create({ ...eventInput, issued: 0 }).save(),
        ]).getAll();
    }

    // get all event
    @Mutation(() => EventResponse)
    async getAllEvent(): Promise<Partial<EventResponse>> {
        const event = await Event.find();
        return new EventResponse('success', 'get all', event).getAll();
    }

    //edit hanle
    @Mutation(() => EventResponse)
    @Authorized(['ghost', 'admin'])
    async editEvent(
        @Arg('input') eventId: string,
        @Ctx() context: Context
    ): Promise<Partial<EventResponse>> {
        const createdBy = (context.req as ResponeRequest).token.payload.id;
        const now = new Date();
        try {
            const eventFind = await AppDataSource.getRepository(Event)
                .createQueryBuilder('event')
                .where('id = :id', { id: eventId })
                .andWhere(
                    new Brackets(qb => {
                        qb.where('event.edit_by IS NULL').orWhere('event.updateAt < :dateBefore ', {
                            dateBefore: new Date(now.getTime() - 5 * 60 * 1000),
                        });
                    })
                )
                .getOne();

            await AppDataSource.getRepository(Event)
                .createQueryBuilder('event')
                .update()
                .set({ edit_by: createdBy })
                .where('id = :id', { id: eventId })
                .execute();

            if (!eventFind) throw new ApolloServerError('Event editing');
            return new EventResponse('success', 'not edit').getAll();
        } catch (err) {
            return new ApolloServerError('try againt: ' + err);
        }
    }

    @Mutation(() => EventResponse)
    async releaseEvent(@Arg('input') eventId: string): Promise<Partial<EventResponse>> {
        try {
            await AppDataSource.getRepository(Event)
                .createQueryBuilder('event')
                .update()
                .set({ edit_by: null })
                .where('id = :id', { id: eventId })
                .execute();
            return new EventResponse('success', ' other users can open it to edit').getAll();
        } catch (err) {
            return new ApolloServerError('try againt: ' + err);
        }
    }

    @Mutation(() => EventResponse)
    @Authorized(['ghost', 'admin'])
    async maintainEvent(
        @Arg('input') eventId: string,
        @Ctx() context: Context
    ): Promise<Partial<EventResponse>> {
        const createdBy = (context.req as ResponeRequest).token.payload.id;
        const now = new Date();
        try {
            const eventMaintain = await AppDataSource.getRepository(Event)
                .createQueryBuilder('event')
                .where('id = :id', { id: eventId })
                .andWhere(
                    new Brackets(qb => {
                        qb.where('event.edit_by = :createdBy', { createdBy: createdBy }).andWhere(
                            'event.updateAt < :dateBefore',
                            {
                                dateBefore: new Date(now.getTime() - 5 * 60 * 1000),
                            }
                        );
                    })
                )
                .getOne();
            if (!eventMaintain) return new EventResponse('error', 'user not permission').getAll();

            await AppDataSource.getRepository(Event)
                .createQueryBuilder('event')
                .update()
                .set({ updateAt: new Date(now.getTime()) })
                .where('id = :id', { id: eventId })
                .execute();
            return new EventResponse('success', 'oke').getAll();
        } catch (err) {
            return new ApolloServerError('try againt: ' + err);
        }
    }
}
