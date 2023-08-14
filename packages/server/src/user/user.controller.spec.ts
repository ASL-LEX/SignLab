import { Test } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from './user.schema';
import { UserController } from './user.controller';
import { RolesGuard } from '../auth/role.guard';
import { ConfigService } from '@nestjs/config';

const testUser1: User = {
  _id: '1',
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

const testUser2: User = {
  _id: '2',
  name: 'sam',
  email: 'sam@bu.edu',
  username: 'sam',
  roles: {
    owner: false,
    studyAdmin: new Map<string, boolean>(),
    projectAdmin: new Map<string, boolean>(),
    studyContributor: new Map<string, boolean>(),
    studyVisible: new Map<string, boolean>()
  },
  organization: '6446bd91d0bf2d1a98124e67'
};

// Test user service
const userService = {
  async findAll() {
    return [testUser1, testUser2];
  },

  async findOne(_query: any) {
    return testUser1;
  },

  addRole: jest.fn((_role: string, id: string) => {
    if (id == testUser1._id || id == testUser2._id) {
      return true;
    } else {
      return false;
    }
  }),

  removeRole: jest.fn((_role: string, id: string) => {
    if (id == testUser1._id || id == testUser2._id) {
      return true;
    } else {
      return false;
    }
  })
};

// Test rolesguard
const rolesGuard = {
  async canActivate() {
    return true;
  }
};

// Test config service
const configService = {
  get(_param: string) {
    return 3;
  }
};

describe('UserController', () => {
  // Controller being tested
  let userController: UserController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: userService
        },
        {
          provide: ConfigService,
          useValue: configService
        }
      ]
    })
      .overrideGuard(RolesGuard)
      .useValue(rolesGuard)
      .compile();

    userController = await module.resolve(UserController);
  });

  describe('getAllUsers()', () => {
    it('should be able to find all of the users', async () => {
      const users = await userController.getAllUsers({ _id: '1', name: 'ASL-LEX' });
      expect(users).toEqual([testUser1, testUser2]);
    });
  });
});
