import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { UserCredentials, UserSignup } from 'shared/dtos/user.dto';
import { User } from '../user/user.schema';
import { AuthService } from './auth.service';
import { hashSync } from 'bcrypt';
import * as usercredentials from './usercredentials.schema';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';

// Test user in the system
const testUser: User = {
  _id: '63c0457d7448ab0b577b5c27',
  name: 'bob',
  email: 'bob@bu.edu',
  username: 'bob',
  roles: {
    owner: false,
    studyAdmin: new Map<string, boolean>(),
    projectAdmin: new Map<string, boolean>(),
    studyContributor: new Map<string, boolean>(),
    studyVisible: new Map<string, boolean>()
  },
  organization: '6446bd91d0bf2d1a98124e67'
};

const testCredentials: UserCredentials = {
  username: 'bob',
  password: 'bobby',
  organization: '6446bd91d0bf2d1a98124e67'
};

// Test interface for user storage
const userService = {
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
    return user;
  },

  async count() {
    return Promise.resolve(1);
  },

  async create(params: UserSignup) {
    return Promise.resolve({
      _id: testUser._id,
      ...params
    });
  }
};

const credentialsModel = {
  findOne(params: any) {
    return {
      async exec() {
        if (params.username == testCredentials.username) {
          return {
            username: testCredentials.username,
            password: hashSync(testCredentials.password, 10)
          };
        } else {
          return null;
        }
      }
    };
  },

  async create(params: any) {
    return params;
  }
};

// Test JWTService
const jwtService = {
  sign(_payload: any) {
    return 'signed';
  }
};

const configService = {
  getOrThrow(_key: string) {
    return {
      min: 4,
      max: 36,
      lowerCase: 1,
      upperCase: 0,
      numeric: 0,
      symbol: 0,
      requirementCount: 3
    };
  }
};

/**
 * Mock the entry schema since it indirectly gets a different module
 * declaration from the `app`
 */
jest.mock('../entry/entry.schema', () => ({
  Entry: () => {
    return { name: 'Entry' };
  }
}));
jest.mock('../entry/entry-upload.schema', () => ({
  EntryUpload: () => {
    return { name: 'Entry' };
  }
}));

describe('AuthService', () => {
  // Service being tested
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: userService
        },
        {
          provide: JwtService,
          useValue: jwtService
        },
        {
          provide: getModelToken(usercredentials.UserCredentials.name),
          useValue: credentialsModel
        },
        {
          provide: ConfigService,
          useValue: configService
        }
      ]
    }).compile();

    authService = await module.resolve(AuthService);
  });

  describe('authenticate()', () => {
    it('should not authenticate a user not found in the system', async () => {
      try {
        await authService.authenticate({
          username: 'sam',
          password: 'sammy',
          organization: '1'
        });

        // Should not get here
        expect(false).toBeTruthy();
      } catch (e) {}
    });

    it('should not authenticate a user with an invalid password', async () => {
      try {
        await authService.authenticate({
          username: testUser.username,
          password: 'sammy',
          organization: '1'
        });

        // Should not get here
        expect(false).toBeTruthy();
      } catch (e: any) {}
    });

    it('should authenticate a user with a valid username + password', async () => {
      const result: any = await authService.authenticate({
        username: testUser.username,
        password: testCredentials.password,
        organization: '1'
      });

      expect(result.token).toEqual('signed');
      expect(result.user._id.toString()).toEqual(testUser._id);
    });
  });

  describe('availability()', () => {
    it('should handle non-available username and non-available email', async () => {
      const result = await authService.availability({
        username: testUser.username,
        email: testUser.email,
        organization: '1'
      });

      expect(result).toEqual({ username: false, email: false });
    });

    it('should handle non-available username and available email', async () => {
      const result = await authService.availability({
        username: testUser.username,
        email: 'sam@bu.edu',
        organization: '1'
      });

      expect(result).toEqual({ username: false, email: true });
    });

    it('should handle available username and non-available email', async () => {
      const result = await authService.availability({
        username: 'sam',
        email: testUser.email,
        organization: '1'
      });

      expect(result).toEqual({ username: true, email: false });
    });

    it('should handle available username and available email', async () => {
      const result = await authService.availability({
        username: 'sam',
        email: 'sam@bu.edu',
        organization: '1'
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
          owner: false,
          studyAdmin: new Map<string, boolean>(),
          projectAdmin: new Map<string, boolean>(),
          studyContributor: new Map<string, boolean>(),
          studyVisible: new Map<string, boolean>()
        },
        _id: '63e2baca1b3b296f1e7da5e1'
      };
      const result: any = await authService.signup(newUser);

      // Password not present on user model
      delete newUser.password;
      // ID comes from mock user service
      expect(result.token).toEqual('signed');
      expect(result.user.toString()).toEqual(testUser._id);
    });
  });
});
