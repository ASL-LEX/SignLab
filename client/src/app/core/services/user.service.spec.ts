import { UserService } from './user.service';

describe('UserService', () => {
  // Test user response data for testing
  const exampleUserData = [
    {
      email: 'bob@bu.edu',
      name: 'bob',
      username: 'bob',
      password: 'hi',
      roles: {
        owner: true,
        studyContributor: new Map<string, boolean>(),
        projectAdmin: new Map<string, boolean>(),
        studyAdmin: new Map<string, boolean>(),
        studyVisible: new Map<string, boolean>()
      },
      organization: {
        _id: '1',
        name: 'ASL-LEX'
      },
      _id: '10'
    },
    {
      email: 'test@bu.edu',
      name: 'test',
      password: 'hi',
      roles: {
        owner: false,
        studyContributor: new Map<string, boolean>(),
        projectAdmin: new Map<string, boolean>(),
        studyAdmin: new Map<string, boolean>(),
        studyVisible: new Map<string, boolean>()
      },
      username: 'test',
      _id: '11',
      organization: {
        _id: '1',
        name: 'ASL-LEX'
      }
    }
  ];

  // Test to make sure the users can be pulled successfully
  it('should get users', async () => {
    // Make a spy that will produce a list of users
    const spy = jasmine.createSpyObj('SignLabHttpClient', ['get']);
    spy.get.and.returnValue(exampleUserData);

    // Make a spy auth service that always returns the same user
    const authSpy = jasmine.createSpyObj('AuthService', [], {
      user: exampleUserData[0]
    });

    // Make the test service
    const service = new UserService(spy, authSpy);

    // Ensure the same users are gotten back
    const result = await service.getUsers();
    expect(result).toEqual(exampleUserData);
  });

  // Adding and removing roles should target the correct REST operations
  it('should call PUT and DELETE for roles', async () => {
    // Make a spy for verifying the methods called
    const spy = jasmine.createSpyObj('SignLabHttpClient', ['put', 'delete']);

    // Make a spy auth service that always returns the same user
    const authSpy = jasmine.createSpyObj('AuthService', [], {
      user: exampleUserData[0]
    });

    // Make the test service
    const service = new UserService(spy, authSpy);

    // Test adding a role to the user
    let result = await service.changeRole(exampleUserData[0], 'tagging', true);
    expect(result).toBeTrue();
    expect(spy.put).toHaveBeenCalledWith('api/users/tagging/10', {}, { provideToken: true });

    // Test deleting a role from the user
    result = await service.changeRole(exampleUserData[0], 'tagging', false);
    expect(result).toBeTrue();
    expect(spy.delete).toHaveBeenCalledWith('api/users/tagging/10', {
      provideToken: true
    });
  });

  // Errors should return false
  it('should return false on error', async () => {
    // Make a spy for inducing errors
    const spy = jasmine.createSpyObj('SignLabHttpClient', ['put']);
    spy.put.and.throwError('Cannot add role');

    // Make a spy auth service that always returns the same user
    const authSpy = jasmine.createSpyObj('AuthService', [], {
      user: exampleUserData[0]
    });

    // Make the test service
    const service = new UserService(spy, authSpy);

    // Test trying to change a role
    const result = await service.changeRole(exampleUserData[0], 'tagging', true);
    expect(result).toBeFalse();
  });
});
