import { Test } from '@nestjs/testing';
import { UserService } from '../../services/user.service';
import { User } from '../../schemas/user.schema';
import { UserController } from './user.controller';

const testUser1: User = {
  _id: '1',
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

const testUser2: User = {
  _id: '2',
  name: 'sam',
  email: 'sam@bu.edu',
  username: 'sam',
  password: 'sammy',
  roles: {
    admin: false,
    tagging: true,
    recording: false,
    accessing: false,
    owner: false,
  },
};

// Test user service
const userService = {
  async findAll() {
    return [testUser1, testUser2];
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
  }),
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
          useValue: userService,
        },
      ],
    }).compile();

    userController = await module.resolve(UserController);
  });

  describe('getAllUsers()', () => {
    it('should be able to find all of the users', async () => {
      const users = await userController.getAllUsers();
      expect(users).toEqual([testUser1, testUser2]);
    });
  });

  describe('addRoleToUser()', () => {
    it('should fail if an invalid ID is provided', async () => {
      expect(userController.addRoleToUser('admin', '3')).rejects.toThrow();
    });

    it('should succeed when provided a valid ID', async () => {
      expect(userController.addRoleToUser('admin', '1')).resolves;

      expect(userService.addRole).toHaveBeenCalledWith('admin', '1');
    });
  });

  describe('removeRoleFromUser()', () => {
    it('should fail if an invalid ID is provided', async () => {
      expect(userController.removeRoleFromUser('admin', '3')).rejects.toThrow();
    });

    it('should succeed when provided a valid ID', async () => {
      expect(userController.removeRoleFromUser('admin', '1')).resolves;

      expect(userService.addRole).toHaveBeenCalledWith('admin', '1');
    });
  });
});