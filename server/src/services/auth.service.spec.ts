import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { UserCredentials, UserSignup } from 'shared/dtos/user.dto';
import { User } from '../schemas/user.schema';
import { AuthService } from './auth.service';
import { hashSync } from 'bcrypt';
import * as usercredentials from '../schemas/usercredentials.schema';

// Test user in the system
const testUser: User = {
  _id: 'bobby',
  name: 'bob',
  email: 'bob@bu.edu',
  username: 'bob',
  roles: {
    admin: true,
    tagging: true,
    recording: true,
    accessing: true,
    owner: false,
  },
};

const testCredentials: UserCredentials = {
  username: 'bob',
  password: 'bobby',
};

// Test interface for user storage
const userModel = {
  // Find that supports looking up by username or email
  findOne(params: any) {
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

  async count() {
    return Promise.resolve(1);
  },

  async create(params: UserSignup) {
    return params;
  },
};

const credentialsModel = {
  findOne(params: any) {
    return {
      async exec() {
        if (params.username == testCredentials.username) {
          return {
            username: testCredentials.username,
            password: hashSync(testCredentials.password, 10),
          };
        } else {
          return null;
        }
      },
    };
  },

  async create(params: any) {
    return params;
  },
};

// Test JWTService
const jwtService = {
  sign(_payload: any) {
    return 'signed';
  },
};

/**
 * Mock the response schema since it indirectly gets a different module
 * declaration from the `app`
 */
jest.mock('../schemas/response.schema', () => ({
  Response: () => {
    return { name: 'Response' };
  },
}));
jest.mock('../schemas/response-upload.schema', () => ({
  ResponseUpload: () => {
    return { name: 'Response' };
  },
}));

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
        {
          provide: JwtService,
          useValue: jwtService,
        },
        {
          provide: getModelToken(usercredentials.UserCredentials.name),
          useValue: credentialsModel,
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
      const result: any = await authService.authenticate({
        username: testUser.username,
        password: testCredentials.password,
      });

      expect(result).toEqual({ token: 'signed', user: testUser });
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
      const newUser: any = {
        username: 'sam',
        email: 'sam@bu.edu',
        name: 'sam',
        password: 'sammy',
        roles: {
          admin: false,
          tagging: false,
          recording: false,
          accessing: false,
          owner: false,
        },
      };
      const result: any = await authService.signup(newUser);

      // Password not present on user model
      delete newUser.password;
      expect(result).toEqual({ token: 'signed', user: newUser });
    });
  });

  describe('isAuthorized()', () => {
    it('should not authorize if a role is not present', async () => {
      const result = await authService.isAuthorized(testUser, [
        'tagging, responding',
      ]);

      expect(result).toBeFalsy();
    });

    it('should authorize if a role is present', async () => {
      const result = await authService.isAuthorized(testUser, [
        'tagging',
        'responding',
        'admin',
      ]);

      expect(result).toBeTruthy();
    });
  });
});
