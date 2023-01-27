import { AuthResponse } from 'shared/dtos/auth.dto';
import { User } from 'shared/dtos/user.dto';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';

describe('AuthService', () => {
  let service: AuthService;

  // Valid credentials for the mocked object
  const validUsername = 'test';
  const validPassword = 'password';

  // Invalid credentials for the mocked object
  const invalidUsername = 'bad';
  const invalidPassword = 'not';

  let tokenSpy: jasmine.SpyObj<TokenService>;

  beforeEach(() => {
    // Make spy for the authentication service, this one will always not
    // authenticate
    const spy = jasmine.createSpyObj('SignLabHttpClient', ['post', 'get']);
    spy.post.and.callFake(() => {
      throw new Error();
    });
    spy.get.and.returnValue(Promise.resolve({}));

    tokenSpy = jasmine.createSpyObj(
      'TokenService',
      ['token', 'storeAuthInformation', 'hasAuthInfo', 'removeAuthInformation'],
      { user: {} }
    );

    // Create unit under test
    service = new AuthService(spy, tokenSpy);
  });

  // When initially setup, the system is not authenticated
  it('should not be authorized on setup', () => {
    tokenSpy.hasAuthInfo.and.returnValue(false);
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
    tokenSpy.hasAuthInfo.and.returnValue(false);
    expect(tokenSpy.storeAuthInformation).not.toHaveBeenCalled();
    expect(service.isAuthenticated()).toEqual(false);
  });

  // Valid username and password combo should work
  it('should authorize valid credentials', async () => {
    // Make a spy that will authenticate
    const spy = jasmine.createSpyObj('SignLabHttpClient', ['post', 'get']);
    const data: AuthResponse = {
      user: {
        email: 'bob@bu.edu',
        name: 'bob',
        roles: {
          owner: false,
          projectAdmin: {},
          studyAdmin: {},
          studyContributor: {}
        },
        username: 'bob',
        _id: 'sadlkfj'
      },
      token: 'some-fake-token'
    };
    spy.post.and.returnValue(data);
    spy.get.and.returnValue(Promise.resolve(data.user));

    tokenSpy.storeAuthInformation.and.callFake((param) => {
      return param;
    });
    tokenSpy.hasAuthInfo.and.returnValue(true);
    (Object.getOwnPropertyDescriptor(tokenSpy, 'user')?.get as jasmine.Spy<() => User>).and.returnValue(data.user);

    service = new AuthService(spy, tokenSpy);

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
    service = new AuthService(spy, tokenSpy);

    const result = await service.isUserAvailable('bob', 'bob@bu.edu');
    expect(result).toEqual({ username: false, email: false });
  });

  // User availability testing, fully available
  it('should be able to know when a username and email is available', async () => {
    // Make a spy that believe every username and email is available
    const spy = jasmine.createSpyObj('SignLabHttpClient', ['get']);
    spy.get.and.returnValue({ username: true, email: true });
    service = new AuthService(spy, tokenSpy);

    const result = await service.isUserAvailable('bob', 'bob@bu.edu');
    expect(result).toEqual({ username: true, email: true });
  });

  // User signup should return valid user
  it('should be able to get back a valid user on signup', async () => {
    // Make a spy that will return back an expected user
    const authResponse: AuthResponse = {
      user: {
        email: 'bob@bu.edu',
        name: 'bob',
        roles: {
          owner: false,
          projectAdmin: {},
          studyAdmin: {},
          studyContributor: {}
        },
        username: 'bob',
        _id: '1'
      },
      token: 'some-fake-token'
    };

    const spy = jasmine.createSpyObj('SignLabHttpClient', ['post']);
    spy.post.and.returnValue(authResponse);
    service = new AuthService(spy, tokenSpy);

    const result = await service.signup(
      authResponse.user.name,
      authResponse.user.email,
      authResponse.user.username,
      'bobby'
    );
    expect(tokenSpy.storeAuthInformation).toHaveBeenCalledWith(authResponse);
    expect(result).toEqual(authResponse.user);
  });
});
