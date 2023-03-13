import { CustomAuthChecker } from './../middlewares/checkAuth';
import express, { Express } from 'express';
import cors from 'cors';
import { buildSchema } from 'type-graphql';
import { resolvers } from '../resolvers';
import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { connectPostgreSQL } from './database.config';
const app = express();

export const App = async (): Promise<Express> => {
    // config app
    app.use(cors());
    app.use(express.json());

    //config apollo app
    const schema = await buildSchema({
        resolvers,
        authChecker: CustomAuthChecker,
        validate: true,
    });

    const serverApollo = new ApolloServer({
        schema,
        debug: false,
        csrfPrevention: true, // highly recommended
        cache: 'bounded',
        context: ({ req, res }) => ({ req, res }),
        plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
    });

    await serverApollo.start();
    serverApollo.applyMiddleware({ app, cors: false });

    //connect db
    connectPostgreSQL();

    return app;
};
