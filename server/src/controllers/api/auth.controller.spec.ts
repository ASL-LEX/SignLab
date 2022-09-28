import { Test, TestingModule } from '@nestjs/testing';
import { Study } from '../../schemas/study.schema';
import { StudyService } from '../../services/study.service';
import {
  UserAvailability,
  UserCredentials,
  UserIdentification,
  UserSignup,
} from 'shared/dtos/user.dto';
import { User } from '../../schemas/user.schema';
import { AuthService } from '../../services/auth.service';
import { AuthController } from './auth.controller';
import { UserStudyService } from '../../services/userstudy.service';

// Test values which are used for testing authentication
const validCredentials: UserCredentials = {
  username: 'bob',
  password: 'bobby',
};
const invalidCredentials: UserCredentials = {
  username: 'sam',
  password: 'sammy',
};

// Test user
const testUser: User = {
  _id: 'bobby',
  name: 'bob',
  email: 'bob@bu.edu',
  username: 'bob',
  password: 'bobby',
  roles: {
    admin: true,
    tagging: false,
    recording: false,
    accessing: false,
    owner: false,
  },
};

const mockAuthService = {
  // `validCredentials` valid, anything else invalid
  async authenticate(credentials: UserCredentials): Promise<User | null> {
    if (credentials == validCredentials) {
      return testUser;
    }
    return null;
  },

  // username: bob and email: bob@bu.edu not available
  async availability(userId: UserIdentification): Promise<UserAvailability> {
    const availability = { username: true, email: true };

    if (userId.username == validCredentials.username) {
      availability.username = false;
    }

    if (userId.email == 'bob@bu.edu') {
      availability.email = false;
    }

    return availability;
  },

  // Return the test user
  async signup(_userSignup: UserSignup): Promise<User> {
    return testUser;
  },
};

const mockStudyService = {
  async getStudies(): Promise<Study[]> {
    return [];
  },
};

const mockUserStudyService = {
  async create(_user: User, _study: Study) {},
};

/**
 * Mock the response schema since it indirectly gets a different module
 * declaration from the `app`
 */
jest.mock('../../schemas/response.schema', () => ({
  Response: () => {
    return { name: 'Response' };
  },
}));
jest.mock('../../schemas/response-upload.schema', () => ({
  ResponseUpload: () => {
    return { name: 'Response' };
  },
}));

describe('AuthController', () => {
  // Controller being tested
  let authController: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: StudyService,
          useValue: mockStudyService,
        },
        {
          provide: UserStudyService,
          useValue: mockUserStudyService,
        },
      ],
    }).compile();

    authController = await module.resolve(AuthController);
  });

  describe('login()', () => {
    it('should return null for an invalid username + password', async () => {
      const session: any = {};
      const result = await authController.login(invalidCredentials);

      // Expect the result to be null
      expect(result).toBeNull;

      // Session should not have a userID field
      expect(session['userID']).toBeUndefined();
    });

    it('should return null for invalid username + valid password', async () => {
      const session: any = {};
      const result = await authController.login(
        {
          username: invalidCredentials.username,
          password: validCredentials.password,
        }
      );

      // Expect the result to be null
      expect(result).toBeNull;

      // Session should not have a userID field
      expect(session['userID']).toBeUndefined();
    });

    it('should return null for valid username + invalid password', async () => {
      const session: any = {};
      const result = await authController.login(
        {
          username: validCredentials.username,
          password: invalidCredentials.password,
        }
      );

      // Expect the result to be null
      expect(result).toBeNull;

      // Session should not have a userID field
      expect(session['userID']).toBeUndefined();
    });

    it('should return user for valid username + valid password', async () => {
      const session: any = {};
      const result = await authController.login(validCredentials);

      // Should be the `testUser`
      expect(result).toEqual(testUser);
    });
  });

  describe('getPasswordComplexity()', () => {
    it('should return the expected password complexity', async () => {
      const passwordComplexity = await authController.getPasswordComplexity();

      // Should match the expected password complexity
      expect(passwordComplexity).toEqual(authController.passwordComplexity);
    });
  });

  describe('userAvailability()', () => {
    it('should return handle non-available username and non-available email', async () => {
      const result = await authController.userAvailabiliy({
        username: 'bob',
        email: 'bob@bu.edu',
      });

      expect(result).toEqual({ username: false, email: false });
    });

    it('should return handle non-available username and available email', async () => {
      const result = await authController.userAvailabiliy({
        username: 'bob',
        email: 'sammy@bu.edu',
      });

      expect(result).toEqual({ username: false, email: true });
    });

    it('should return handle available username and non-available email', async () => {
      const result = await authController.userAvailabiliy({
        username: 'sam',
        email: 'bob@bu.edu',
      });

      expect(result).toEqual({ username: true, email: false });
    });

    it('should return handle available username and available email', async () => {
      const result = await authController.userAvailabiliy({
        username: 'sam',
        email: 'sammy@bu.edu',
      });

      expect(result).toEqual({ username: true, email: true });
    });
  });

  describe('userSignup()', () => {
    it('should throw an error on non-available username and non-available email', async () => {
      const userSignup = {
        username: 'bob',
        email: 'bob@bu.edu',
        name: 'bob',
        password: 'bobby',
      };
      await expect(authController.userSignup(userSignup)).rejects.toThrow();
    });

    it('should throw an error on non-available username and available email', async () => {
      const userSignup = {
        username: 'bob',
        email: 'sammy@bu.edu',
        name: 'bob',
        password: 'bobby',
      };
      await expect(authController.userSignup(userSignup)).rejects.toThrow();
    });

    it('should throw an error on available username and non-available email', async () => {
      const userSignup = {
        username: 'sam',
        email: 'bob@bu.edu',
        name: 'bob',
        password: 'bobby',
      };
      await expect(authController.userSignup(userSignup)).rejects.toThrow();
    });

    it('should throw an error on password which lacks complexity requirements', async () => {
      const userSignup = {
        username: 'bob',
        email: 'bob@bu.edu',
        name: 'bob',
        password: 'boo',
      };
      await expect(authController.userSignup(userSignup)).rejects.toThrow();
    });

    it('should return a valid user when given valid user signup', async () => {
      const userSignup = {
        username: 'sam',
        email: 'sammy@bu.edu',
        name: 'sam',
        password: 'sammy',
      };
      const result = await authController.userSignup(userSignup);

      expect(result).toEqual(testUser);
    });
  });
});
