import { User } from './../entities/User.entity';
// import { checkAuth } from './../middlewares/checkAuth';
import { ApolloServerError } from './../utils/Errors/query_error';
import { LoggerError } from './../utils/logger/winston.logger';
import { InputUser, LoginUser, UpdateUser, UseTokenInterface } from '../types/user.types';
import { Resolver, Query, Mutation, Arg, Authorized } from 'type-graphql';
import { UserResponse } from '../types/user.types';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { generateToken } from '../middlewares/handleToken';
import jwt from 'jsonwebtoken';

dotenv.config();

const { SALT_ROUNDS, REFESH_SIGNINGKEY } = process.env;

@Resolver()
class UserResolver {
    //test query
    @Query(() => String)
    @Authorized('ghost')
    helloUser(): string {
        return 'hello user';
    }

    // find use by username
    @Query(() => User)
    @Authorized('ghost')
    async getUser(@Arg('username') username: string): Promise<User | undefined> {
        const userFind = await User.findOneBy({ username: username });
        if (!userFind) throw new ApolloServerError('user not find');
        return userFind;
    }

    //get all user
    @Query(() => [User])
    @Authorized('ghost')
    async getAllUser(): Promise<User[]> {
        return await User.find();
    }

    //update user
    @Mutation(() => Boolean)
    @Authorized('ghost')
    async updateUser(@Arg('input') userUpdate: UpdateUser): Promise<boolean> {
        const userFind = await User.findOne({ where: { id: userUpdate.id } });

        if (!userFind) throw new ApolloServerError('user not found');

        await User.update({ id: userUpdate.id }, { ...userUpdate });
        return true;
    }

    //Delete User
    @Mutation(() => Boolean)
    async deleteUser(@Arg('id') idUser: string): Promise<boolean> {
        const userFind = await User.findOne({ where: { id: idUser } });

        if (!userFind) throw new ApolloServerError('user not found');

        await User.delete(idUser);

        return true;
    }

    //Register user
    @Mutation(() => UserResponse)
    async registerUser(@Arg('input') userInput: InputUser): Promise<Partial<UserResponse>> {
        try {
            const userFind = await User.findOneBy({ username: userInput.username });

            if (userFind) return new UserResponse('error', 'user exits ').get();

            const user = new User();
            user.username = userInput.username;
            user.age = userInput.age;
            user.email = userInput.email;
            user.password = await bcrypt.hash(userInput.password, +SALT_ROUNDS);

            return new UserResponse('success', 'create user successfully', [
                await user.save(),
            ]).get();
        } catch (err) {
            LoggerError(err);
        }
    }

    //Login user
    @Mutation(() => UserResponse)
    async loginUser(@Arg('input') loginUser: LoginUser): Promise<Partial<UserResponse>> {
        try {
            const userFind = await User.findOneBy({ username: loginUser.username });
            if (!userFind) return new UserResponse('error', 'username not fund').get();

            const checkPassword = await bcrypt.compare(loginUser.password, userFind.password);
            if (!checkPassword) return new UserResponse('error', 'password error').get();
            return new UserResponse(
                'success',
                'login successful',
                [userFind],
                generateToken({
                    id: userFind.id,
                    username: userFind.username,
                    email: userFind.email,
                    role: userFind.role,
                })
            ).get();
        } catch (err) {
            LoggerError(err);
        }
    }

    //refesh token
    @Mutation(() => UserResponse)
    async refeshToken(@Arg('input') refeshToken: string): Promise<Partial<UserResponse>> {
        try {
            const payLoad = jwt.verify(refeshToken, REFESH_SIGNINGKEY) as UseTokenInterface;

            const userFind = await User.findOne({ where: { id: payLoad.id } });

            if (!userFind) return new UserResponse('error', 'Authorization').get();
            return new UserResponse(
                'success',
                'refeshtoken successfully',
                [userFind],
                generateToken(payLoad)
            ).get();
        } catch (err) {
            LoggerError(err);
        }
    }
}

export { UserResolver };
