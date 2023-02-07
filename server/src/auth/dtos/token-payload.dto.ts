import { User } from '../../user/user.schema';

export type TokenPayload = Omit<User, 'name' | 'email' | 'username' | 'password'>;
