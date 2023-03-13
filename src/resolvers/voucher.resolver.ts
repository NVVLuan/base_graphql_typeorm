import { Arg, Authorized, Ctx, Mutation, Resolver } from 'type-graphql';
import { Event } from '../entities/Event.entity';
import { Status, Voucher } from '../entities/Voucher.entity';
import { InputVoucher } from '../types/voucher.types/voucher.input';
import { VoucherResponse } from '../types/voucher.types/Voucher.response';
import voucher_codes from 'voucher-code-generator';
import { AppDataSource } from '../configs/database.config';
import { v4 as uuidv4 } from 'uuid';
import { sendMailJob } from '../utils/bull/queues/queue.email';
import { Context } from '../types/Icontext.type';
import { ResponeRequest } from '../middlewares/checkAuth';
import { User } from '../entities/User.entity';

@Resolver()
export class VoucherResolver {
    @Mutation(() => VoucherResponse)
    async createVoucher(@Arg('input') voucherInput: InputVoucher): Promise<VoucherResponse> {
        const voucherCode = voucher_codes.generate({
            pattern: '########-########-########',
            prefix: 'luannvv-',
            postfix: '-2023',
        })[0];

        //handle transaction in voucher v1
        await AppDataSource.manager.transaction(
            'SERIALIZABLE',
            async transactionalEntityManager => {
                const eventFind = await transactionalEntityManager
                    .createQueryBuilder(Event, 'event')
                    .where('event.id = :id', { id: voucherInput.event })
                    .andWhere(`event.issued <= event.max_quantity - ${voucherInput.quantity}`)
                    .getOne();

                if (!eventFind) {
                    return {
                        status: 'error',
                        message: 'quantity voucher max',
                    };
                }
                await transactionalEntityManager
                    .createQueryBuilder()
                    .insert()
                    .into(Voucher)
                    .values([
                        ...new Array(voucherInput.quantity).fill(undefined).map(() => {
                            return { id: uuidv4(), code: voucherCode, event: eventFind };
                        }),
                    ])
                    .execute();

                await transactionalEntityManager
                    .createQueryBuilder(Event, 'event')
                    .update(Event)
                    .set({ issued: () => `issued + ${voucherInput.quantity}` })
                    .where('id = :id', { id: voucherInput.event })
                    .execute();
            }
        );

        //Handle transaction in voucher v2
        // const queryRunner = AppDataSource.createQueryRunner();
        // await queryRunner.connect();
        // const eventFind = await queryRunner.manager
        //     .createQueryBuilder(Event, 'event')
        //     .where('event.id = :id', { id: voucherInput.event })
        //     .andWhere(`event.issued <= event.max_quantity - ${voucherInput.quantity}`)
        //     .getOne();

        // if (!eventFind) {
        //     return {
        //         status: 'error',
        //         message: 'quantity voucher max',
        //     };
        // }

        // await queryRunner.startTransaction();
        // try {
        //     // execute some operations on this transaction:

        //     await queryRunner.manager
        //         .createQueryBuilder(Event, 'event')
        //         .update(Event)
        //         .set({ issued: () => `issued + ${voucherInput.quantity}` })
        //         .where('id = :id', { id: voucherInput.event })
        //         .execute();

        //     await queryRunner.manager
        //         .createQueryBuilder()
        //         .insert()
        //         .into(Voucher)
        //         .values([
        //             ...new Array(voucherInput.quantity).fill(undefined).map(() => {
        //                 return { id: uuidv4(), code: voucherCode, event: eventFind };
        //             }),
        //         ])
        //         .execute();

        //     await queryRunner.commitTransaction();
        // } catch (err) {
        //     await queryRunner.rollbackTransaction();
        // } finally {
        //     // you need to release query runner which is manually created:
        //     await queryRunner.release();
        // }

        return {
            status: 'success',
            message: 'create voucher success',
        };
    }

    // send voucher for user
    @Authorized('ghost')
    @Mutation(() => VoucherResponse)
    async sendVoucher(
        @Arg('input') voucherInput: string,
        @Ctx() context: Context
    ): Promise<VoucherResponse> {
        //hanlde check input
        const createdBy = (context.req as ResponeRequest).token.payload.id;
        const from: string = (context.req as ResponeRequest).token.payload.email;

        try {
            const userFind = await User.findOne({ where: { id: createdBy } });

            const getUserSend = await AppDataSource.getRepository(Voucher)
                .createQueryBuilder()
                .relation(Voucher, 'user')
                .of({ id: voucherInput, user: userFind })
                .loadOne();

            if (!userFind || getUserSend) {
                return {
                    status: 'error',
                    message: 'user illegal',
                };
            }

            // //Handle transaction in voucher
            const queryRunner = AppDataSource.createQueryRunner();
            await queryRunner.connect();

            await queryRunner.startTransaction();
            try {
                await queryRunner.manager
                    .createQueryBuilder()
                    .update(Voucher)
                    .set({ user: createdBy, status: Status.ACTIVE })
                    .where('id = :id', { id: voucherInput })
                    .execute();

                await queryRunner.commitTransaction();
            } catch (err) {
                await queryRunner.rollbackTransaction();
            } finally {
                // you need to release query runner which is manually created:
                await queryRunner.release();
            }
            //handle send eamil for user
            const voucher_codes = await Voucher.findOne({
                where: { id: voucherInput, status: Status.ACTIVE },
            });

            if (!voucher_codes)
                return {
                    status: 'error',
                    message: 'send error',
                };

            // await sendMailJob({
            //     from: from,
            //     to: userFind.email as string,
            //     subject: 'voucher for you',
            //     title: 'Voucher for you',
            //     content: `Code voucher: ${voucher_codes.code}`,
            //     id_voucher: voucherInput,
            // });

            return {
                status: 'success',
                message: 'send email success',
            };
        } catch (error) {
            return {
                status: 'error',
                message: 'user illegal' + error,
            };
        }
    }
}
