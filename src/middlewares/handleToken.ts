import { TokenObject, UseTokenInterface } from '../types/user.types';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const { TYPE_TOKEN, EXPIRES, SIGNINGKEY, REFESH_SIGNINGKEY } = process.env;

export const generateToken = (userToken: UseTokenInterface, expiresTemp?: string): TokenObject => {
    return {
        tokenType: TYPE_TOKEN,
        accessToken: jwt.sign({ payload: userToken }, SIGNINGKEY, {
            expiresIn: expiresTemp ? expiresTemp : EXPIRES,
        }),
        refeshToken: jwt.sign({ payload: userToken }, REFESH_SIGNINGKEY, {
            expiresIn: expiresTemp ? expiresTemp : EXPIRES,
        }),
    };
};
