import { UserService } from "./user.service";

describe('UserService', () => {
  // Test user response data for testing
  const exampleUserData = [
    {
      email: 'bob@bu.edu',
      name: 'bob',
      username: 'bob',
      password: 'hi',
      roles: {
        admin: false,
        tagging: true,
        recording: true,
        accessing: false,
        owner: false,
      },
      _id: '10'
    },
    {
      email: 'test@bu.edu',
      name: 'test',
      password: 'hi',
      roles: {
        admin: false,
        tagging: false,
        recording: false,
        accessing: false,
        owner: false
      },
      username: 'test',
      _id: '11'
    }
  ];

  // Test to make sure the users can be pulled successfully
  it('should get users', async () => {
    // Make a spy that will produce a list of users
    const spy = jasmine.createSpyObj('HttpClient', ['get', 'toPromise']);
    spy.get.and.returnValue(spy);
    spy.toPromise.and.returnValue(exampleUserData);

    // Make the test service
    const service = new UserService(spy);

    // Ensure the same users are gotten back
    const result = await service.getUsers();
    expect(result).toEqual(exampleUserData);
  });

  // Adding and removing roles should target the correct REST operations
  it('should call PUT and DELETE for roles', async () => {
    // Make a spy for verifying the methods called
    const spy = jasmine.createSpyObj('HttpClient', ['put', 'delete', 'toPromise']);
    spy.put.and.returnValue(spy);
    spy.delete.and.returnValue(spy);

    // Make the test service
    const service = new UserService(spy);

    // Test adding a role to the user
    let result = await service.changeRole(exampleUserData[0], "tagging", true);
    expect(result).toBeTrue();
    expect(spy.put).toHaveBeenCalledWith('http://localhost:3000/api/users/tagging/10', null);

    // Test deleting a role from the user
    result = await service.changeRole(exampleUserData[0], "tagging", false);
    expect(result).toBeTrue();
    expect(spy.delete).toHaveBeenCalledWith('http://localhost:3000/api/users/tagging/10');
  });

  // Errors should return false
  it('should return false on error', async () => {
    // Make a spy for inducing errors
    const spy = jasmine.createSpyObj('HttpClient', ['put', 'toPromise']);
    spy.put.and.returnValue(spy);
    spy.toPromise.and.throwError('Cannot add role');

    // Make the test service
    const service = new UserService(spy);

    // Test trying to change a role
    const result = await service.changeRole(exampleUserData[0], "tagging", true);
    expect(result).toBeFalse();
  });

});
