import { Resolver, Query } from 'type-graphql';

@Resolver()
export class TestResolver {
    @Query(() => String)
    helloworld() {
        return 'hello world';
    }
}
