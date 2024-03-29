import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { User } from './user.schema';
import { UserService } from './user.service';

const testUsers: User[] = [
  {
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
    organization: '1'
  },
  {
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
    organization: '1'
  }
];

const userModel = {
  find: jest.fn(() => {
    return {
      exec() {
        return testUsers;
      }
    };
  }),

  findOneAndUpdate: jest.fn((search, _update) => {
    return {
      exec() {
        if (search._id == testUsers[0]._id) {
          return testUsers[0];
        }
        if (search._id == testUsers[1]._id) {
          return testUsers[1];
        }
        return null;
      }
    };
  })
};

describe('UserService', () => {
  // Service being tested
  let userService: UserService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: userModel
        }
      ]
    }).compile();

    userService = await module.resolve(UserService);
  });

  describe('findAll()', () => {
    it('should be able to find all users', async () => {
      const result = await userService.findAll({});

      expect(result).toEqual(testUsers);
      expect(userModel.find).toHaveBeenCalled();
    });
  });

  describe('addRole()', () => {
    it('should failed to add a role on a non-existing user', async () => {
      const result = await userService.addRole('admin', '3');

      expect(result).toBeFalsy();
    });

    it('should succeed on adding a role to an existing user', async () => {
      const result = await userService.addRole('admin', '2');

      expect(result).toBeTruthy();
    });
  });

  describe('removeRole()', () => {
    it('should failed to add a role on a non-existing user', async () => {
      const result = await userService.removeRole('admin', '3');

      expect(result).toBeFalsy();
    });

    it('should succeed on adding a role to an existing user', async () => {
      const result = await userService.removeRole('admin', '2');

      expect(result).toBeTruthy();
    });
  });
});
