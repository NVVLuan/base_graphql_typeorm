import { UseTokenInterface } from './../types/user.types/Iuser.token';
// import { AuthenticationError } from 'apollo-server';
import { ResolverData, AuthCheckerInterface } from 'type-graphql';
import { Context } from '../types/Icontext.type';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Request } from 'express';
import { User } from '../entities/User.entity';

dotenv.config();
const signingKey = process.env.SIGNINGKEY;

export interface ResponeRequest extends Request {
    token: JwtPayload;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// export const checkAuth: MiddlewareFn<Context> = ({ context }, next) => {
//     const authHeader = context.req.header('Authorization');
//     const assessToken = authHeader && authHeader.split(' ')[1];

//     if (!assessToken) throw new AuthenticationError('FORBIDDEN');

//     jwt.verify(assessToken, signingKey as string, (err: VerifyErrors | null, payload) => {
//         if (err !== null || payload === undefined) {
//             throw new AuthenticationError('VALIDATE TOKEN ERROR');
//         }
//         (context.req as Request as ResponeRequest).token = payload as JwtPayload;
//     });

//     return next();
// };

export class CustomAuthChecker implements AuthCheckerInterface<Context> {
    async check({ context }: ResolverData<Context>, roles: string[]): Promise<boolean> {
        const authHeader = context.req.header('Authorization');
        const assessToken = authHeader && authHeader.split(' ')[1];

        if (!assessToken) return false;

        const decode = jwt.verify(assessToken, signingKey as string) as UseTokenInterface;

        const userFind = await User.findOne({ where: { id: decode.id } });

        if (!userFind) return false;

        if (!roles.includes(userFind.role)) return false;
        (context.req as Request as ResponeRequest).token = decode as JwtPayload;
        return true;
    }
}
