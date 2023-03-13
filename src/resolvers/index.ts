import { VoucherResolver } from './voucher.resolver';
import { TestResolver } from './test.resolver';
import { UserResolver } from './user.resolver';
import { BuildSchemaOptions } from 'type-graphql';
import { EventResolver } from './event.resolver';

export const resolvers = [
    TestResolver,
    UserResolver,
    EventResolver,
    VoucherResolver,
] as BuildSchemaOptions['resolvers'];
