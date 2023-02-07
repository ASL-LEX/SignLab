import { User } from '../../user/user.schema';

export interface TokenPayload extends Omit<User, 'name' | 'email' | 'username' | 'password'> {}
