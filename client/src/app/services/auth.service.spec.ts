import { AuthService } from "./auth.service";

describe('AuthService', () => {
  let service: AuthService;

  // Valid credentials for the mocked object
  const validUsername = 'test';
  const validPassword = 'password';

  // Invalid credentials for the mocked object
  const invalidUsername = 'bad';
  const invalidPassword = 'not';

  beforeEach(() => {
    // Make spy for the authentication service, this one will always not
    // authenticate
    const spy = jasmine.createSpyObj('HttpClient', ['post', 'toPromise']);
    spy.post.and.returnValue(spy);
    spy.toPromise.and.callFake(() => { throw new Error(); });

    // Create unit under test
    service = new AuthService(spy);
  });

  // When initially setup, the system is not authenticated
  it('should not be authorized on setup', () => {
    expect(service.isAuthenticated()).toEqual(false);
  });

  // Invalid username and password combo shouldn't work
  it('should not authenticate invalid credentials', async () => {
    // Invalid username, invalid password
    let result = await service.authenticate(invalidUsername, invalidPassword);
    expect(result).toEqual(null);

    // Invalid username, valid password
    result = await service.authenticate(invalidUsername, validPassword);
    expect(result).toEqual(null);

    // Valid username, invalid password
    result = await service.authenticate(validUsername, invalidPassword);
    expect(result).toEqual(null);

    // At this point, should still not be authenticated
    expect(service.isAuthenticated()).toEqual(false);
  });

  // Valid username and password combo should work
  it('should authorize valid credentials', async () => {
    // Make a spy that will authenticate
    const spy = jasmine.createSpyObj('HttpClient', ['post', 'toPromise'])
    spy.post.and.returnValue(spy);
    spy.toPromise.and.returnValue({
      authHeader: 'test',
      user: {
        email: 'bob@bu.edu',
        name: 'bob',
        roles: [],
        username: 'bob',
        _id: 'sadlkfj'
      }
    });
    service = new AuthService(spy);

    const result = await service.authenticate(validUsername, validPassword);
    expect(result).not.toEqual(null);
    expect(result?.username).toEqual('bob');

    // At this point should be authenticated
    expect(service.isAuthenticated()).toEqual(true);
  });
});
