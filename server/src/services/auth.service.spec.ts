import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { UserIdentification, UserSignup } from 'src/dtos/user.dto';
import { User } from '../schemas/user.schema';
import { AuthService } from './auth.service';

// Test user in the system
const testUser: User = {
  _id: 'bobby',
  name: 'bob',
  email: 'bob@bu.edu',
  username: 'bob',
  password: 'bobby',
  roles: new Map<string, boolean>([['admin', true]]),
};

// Test interface for user storage
const userModel = {
  // Find that supports looking up by username or email
  findOne(params) {
    let user: User | null = null;
    if (params.username == testUser.username) {
      user = testUser;
    }
    if (params.email == testUser.email) {
      user = testUser;
    }
    if (params._id == testUser._id) {
      user = testUser;
    }

    return {
      async exec() {
        return user;
      },
    };
  },

  async create(params: UserSignup) {
    return params;
  },
};

describe('AuthService', () => {
  // Service being tested
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getModelToken(User.name),
          useValue: userModel,
        },
      ],
    }).compile();

    authService = await module.resolve(AuthService);
  });

  describe('authenticate()', () => {
    it('should not authenticate a user not found in the system', async () => {
      const result = await authService.authenticate({
        username: 'sam',
        password: 'sammy',
      });

      expect(result).toBeNull();
    });

    it('should not authenticate a user with an invalid password', async () => {
      const result = await authService.authenticate({
        username: testUser.username,
        password: 'sammy',
      });

      expect(result).toBeNull();
    });

    it('should authenticate a user with a valid username + password', async () => {
      const result = await authService.authenticate({
        username: testUser.username,
        password: testUser.password,
      });

      expect(result).toEqual(testUser);
    });
  });

  describe('availability()', () => {
    it('should handle non-available username and non-available email', async () => {
      const result = await authService.availability({
        username: testUser.username,
        email: testUser.email,
      });

      expect(result).toEqual({ username: false, email: false });
    });

    it('should handle non-available username and available email', async () => {
      const result = await authService.availability({
        username: testUser.username,
        email: 'sam@bu.edu',
      });

      expect(result).toEqual({ username: false, email: true });
    });

    it('should handle available username and non-available email', async () => {
      const result = await authService.availability({
        username: 'sam',
        email: testUser.email,
      });

      expect(result).toEqual({ username: true, email: false });
    });

    it('should handle available username and available email', async () => {
      const result = await authService.availability({
        username: 'sam',
        email: 'sam@bu.edu',
      });

      expect(result).toEqual({ username: true, email: true });
    });
  });

  describe('signup()', () => {
    it('should return a user after signup', async () => {
      const newUser: UserSignup = {
        username: 'sam',
        email: 'sam@bu.edu',
        name: 'sam',
        password: 'sammy',
      };
      const result = await authService.signup(newUser);
      expect(result).toEqual(newUser);
    });
  });

  describe('isAuthorized()', () => {
    it('should not authorize if a role is not present', async () => {
      const result = await authService.isAuthorized(testUser._id, [
        'tagging, responding',
      ]);

      expect(result).toBeFalsy();
    });

    it('should authorize if a role is present', async () => {
      const result = await authService.isAuthorized(testUser._id, [
        'tagging',
        'responding',
        'admin',
      ]);

      expect(result).toBeTruthy();
    });
  });
});
