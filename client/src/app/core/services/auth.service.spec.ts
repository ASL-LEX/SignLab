import { AuthService } from './auth.service';

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
    const spy = jasmine.createSpyObj('SignLabHttpClient', ['post']);
    spy.post.and.callFake(() => {
      throw new Error();
    });

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
    const spy = jasmine.createSpyObj('SignLabHttpClient', ['post']);
    spy.post.and.returnValue({
      email: 'bob@bu.edu',
      name: 'bob',
      roles: new Map<string, boolean>(),
      username: 'bob',
      _id: 'sadlkfj',
    });
    service = new AuthService(spy);

    const result = await service.authenticate(validUsername, validPassword);
    expect(result).not.toEqual(null);
    expect(result?.username).toEqual('bob');

    // At this point should be authenticated
    expect(service.isAuthenticated()).toEqual(true);
  });

  // User availability testing, not-available
  it('should be able to know when username and email is not available', async () => {
    // Make a spy that "knows" of a used email and username
    const spy = jasmine.createSpyObj('SignLabHttpClient', ['get']);
    spy.get.and.returnValue({ username: false, email: false });
    service = new AuthService(spy);

    const result = await service.isUserAvailable('bob', 'bob@bu.edu');
    expect(result).toEqual({ username: false, email: false });
  });

  // User availability testing, fully available
  it('should be able to know when a username and email is available', async () => {
    // Make a spy that believe every username and email is available
    const spy = jasmine.createSpyObj('SignLabHttpClient', ['get']);
    spy.get.and.returnValue({ username: true, email: true });
    service = new AuthService(spy);

    const result = await service.isUserAvailable('bob', 'bob@bu.edu');
    expect(result).toEqual({ username: true, email: true });
  });

  // User signup should return valid user
  it('should be able to get back a valid user on signup', async () => {
    // Make a spy that will return back an expected user
    const user = {
      email: 'bob@bu.edu',
      name: 'bob',
      password: 'hi',
      roles: {
        admin: false,
        tagging: false,
        recording: false,
        accessing: false,
        owner: false,
      },
      username: 'bob',
      _id: '1',
    };
    const spy = jasmine.createSpyObj('SignLabHttpClient', ['post']);
    spy.post.and.returnValue(user);
    service = new AuthService(spy);

    const result = await service.signup(
      user.name,
      user.email,
      user.username,
      'bobby'
    );
    expect(result).toEqual(user);
  });
});
