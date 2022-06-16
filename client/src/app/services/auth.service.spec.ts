import { AuthService } from "./auth.service";

describe('AuthService', () => {
  let service: AuthService;

  // Valid credentials for the mocked object
  const validUsername = 'test@bu.edu';
  const validPassword = 'password';

  // Invalid credentials for the mocked object
  const invalidUsername = 'bad@bu.edu';
  const invalidPassword = 'not';

  beforeEach(() => {
    // Make spy for the authentication service
    const spy = jasmine.createSpyObj('AngularFireAuth', ['signInWithEmailAndPassword']);
    spy.signInWithEmailAndPassword.and.callFake((username: string, password: string) => {
      if(username == validUsername && password == validPassword) {
        // Return a valid user with a known uid
        return {
          user: {
            uid: 'bob'
          }
        }
      }
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
    const result = await service.authenticate(validUsername, validPassword);
    expect(result).toEqual('bob');

    // At this point should be authenticated
    expect(service.isAuthenticated()).toEqual(true);
  });
});
