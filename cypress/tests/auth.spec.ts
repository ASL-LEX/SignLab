import { SinonStub } from 'cypress/types/sinon';
import user from '../fixtures/users.json';

describe('User Login', () => {
  // Used for checking alert messages
  let alertStub: SinonStub;

  const usernameField = '[data-cy="usernameField"]';
  const passwordField = '[data-cy="passwordField"]';
  const submitButton = '[data-cy="loginSubmit"]';

  before(() => {
    cy.resetDB();
    cy.firstTimeSetup();
  });

  beforeEach(() => {
    alertStub = cy.stub();
    cy.on('window:alert', alertStub);
  });

  it('should be able to navigate to login page', () => {
    cy.visit('/auth');
  });

  it('should get an alert when submitting with no information', () => {
    cy.visit('/auth');

    cy
      .get(submitButton)
      .click()
      .and(() => {
        expect(alertStub.getCall(0)).to.be.calledWith('Please enter username and password');
      });
  });

  it('should get an alert when only submitting with username', () => {
    cy.visit('/auth');
    cy
      .get(usernameField)
      .type(user.existingUser.username)
      .get(submitButton)
      .click()
      .and(() => {
        expect(alertStub.getCall(0)).to.be.calledWith('Please enter username and password');
      });
  });

  it('should get an alert when only submitting with password', () => {
    cy.visit('/auth');
    cy
      .get(passwordField)
      .type(user.existingUser.password)
      .get(submitButton)
      .click()
      .and(() => {
        expect(alertStub.getCall(0)).to.be.calledWith('Please enter username and password');
      });
  });

  it('should fail on incorrect username + incorrect password', () => {
    cy.visit('/auth');
    cy
      .get(usernameField)
      .type('wrong')
      .get(passwordField)
      .type('wrong')
      .get(submitButton)
      .click()
      .and(() => {
         expect(alertStub.getCall(0)).to.be.calledWith('Username or password is invalid');
      });
  });

  it('should fail on incorrect username + correct pasword', () => {
    cy.visit('/auth');

    cy
      .get(usernameField)
      .type('wrong')
      .get(passwordField)
      .type(user.existingUser.password)
      .get(submitButton)
      .click()
      .and(() => {
        expect(alertStub.getCall(0)).to.be.calledWith('Username or password is invalid');
      });
  });

  it('should fail on correct username + incorrect password', () => {
    cy.visit('/auth');

    cy
      .get(usernameField)
      .type(user.existingUser.username)
      .get(passwordField)
      .type('wrong')
      .get(submitButton)
      .click()
      .and(() => {
        expect(alertStub.getCall(0)).to.be.calledWith('Username or password is invalid');
      });
  });

  it('should work on correct username + correct pasword', () => {
    cy.visit('/auth');

    cy
      .get(usernameField)
      .type(user.existingUser.username)
      .get(passwordField)
      .type(user.existingUser.password)
      .get(submitButton)
      .click()
      .then(() => {
        expect(alertStub.notCalled);
        cy.url().should('be.equal', `${Cypress.config("baseUrl")}/`);
      });
  });
});

describe('User Signup', () => {
  // Used for checking alert messages
  let alertStub: SinonStub;

  const nameField = '[data-cy="signupNameField"]';
  const emailField = '[data-cy="signupEmailField"]';
  const usernameField = '[data-cy="signupUsernameField"]';
  const passwordField = '[data-cy="signupPasswordField"]';
  const confirmPassField = '[data-cy="signupConfirmPassField"]';
  const submitButton = '[data-cy="signupSubmit"]';

  before(() => {
    cy.resetDB();
    cy.firstTimeSetup();
  });

  beforeEach(() => {
    alertStub = cy.stub();
    cy.on('window:alert', alertStub);

    cy.visit('/auth');
    cy
      .get('div.mat-tab-label-content')
      .eq(1)
      .click();

    // Wait for animation to complete
    cy.wait(100);
  });

  it('should not allow signing up with empty form', () => {
    cy
      .get(submitButton)
      .should('be.disabled');
  });

  it('should not submit with a missing name', () => {
    cy
      .get(emailField)
      .type(user.newUser.email)
      .get(usernameField)
      .type(user.existingUser.username)
      .get(passwordField)
      .type(user.existingUser.password)
      .get(confirmPassField)
      .type(user.existingUser.password)
      .get(submitButton)
      .should('be.disabled');
  });

  it('should not submit with a missing email', () => {
    cy
      .get(nameField)
      .type(user.newUser.name)
      .get(usernameField)
      .type(user.newUser.username)
      .get(passwordField)
      .type(user.newUser.password)
      .get(confirmPassField)
      .type(user.newUser.password)
      .get(submitButton)
      .should('be.disabled');
  });

  it('should not submit with a missing username', () => {
    cy
      .get(nameField)
      .type(user.newUser.name)
      .get(emailField)
      .type(user.newUser.email)
      .get(passwordField)
      .type(user.newUser.password, { force: true })
      .get(confirmPassField)
      .type(user.newUser.password)
      .get(submitButton)
      .should('be.disabled');
  });

  it('should not submit with a missing password', () => {
    cy
      .get(nameField)
      .type(user.newUser.name)
      .get(usernameField)
      .type(user.newUser.username)
      .get(emailField)
      .type(user.newUser.email)
      .get(passwordField)
      .type(user.newUser.password)
      .get(submitButton)
      .should('be.disabled');
  });

  it('should not submit with a missing confirm password', () => {
    cy
      .get(nameField)
      .type(user.newUser.name)
      .get(usernameField)
      .type(user.newUser.username)
      .get(emailField)
      .type(user.newUser.email)
      .get(passwordField)
      .type(user.newUser.password)
      .get(submitButton)
      .should('be.disabled');
  });

  it('should not submit with a non-matching passwords', () => {
    cy
      .get(nameField)
      .type(user.newUser.name)
      .get(usernameField)
      .type(user.newUser.username)
      .get(emailField)
      .type(user.newUser.email)
      .get(passwordField)
      .type(user.newUser.password)
      .get(confirmPassField)
      .type(user.newUser.password + 'something else')
      .get(submitButton)
      .should('be.disabled');
  });

  it('should get alert with using existing username + email', () => {
    cy
      .get(nameField)
      .type(user.newUser.name)
      .get(usernameField)
      .type(user.existingUser.username)
      .get(emailField)
      .type(user.existingUser.email)
      .get(passwordField)
      .type(user.newUser.password)
      .get(confirmPassField)
      .type(user.newUser.password)
      .get(submitButton)
      .click()
      .and(() => {
        expect(alertStub.getCall(0)).to.be.calledWith(`${user.existingUser.username} is not an available username\n${user.existingUser.email} is not an available email`);
      });
  });

  it('should get alert with using existing username', () => {
    cy
      .get(nameField)
      .type(user.newUser.name)
      .get(usernameField)
      .type(user.existingUser.username)
      .get(emailField)
      .type(user.newUser.email)
      .get(passwordField)
      .type(user.newUser.password)
      .get(confirmPassField)
      .type(user.newUser.password)
      .get(submitButton)
      .click()
      .and(() => {
        expect(alertStub.getCall(0)).to.be.calledWith(`${user.existingUser.username} is not an available username\n`);
      });
  });

  it('should get alert with using existing email', () => {
    cy
      .get(nameField)
      .type(user.newUser.name)
      .get(usernameField)
      .type(user.newUser.username)
      .get(emailField)
      .type(user.existingUser.email)
      .get(passwordField)
      .type(user.newUser.password)
      .get(confirmPassField)
      .type(user.newUser.password)
      .get(submitButton)
      .click()
      .and(() => {
        expect(alertStub.getCall(0)).to.be.calledWith(`${user.existingUser.email} is not an available email`);
      });
  });

  it('should submit with valid information', () => {
    cy
      .get(nameField)
      .type(user.newUser.name)
      .get(usernameField)
      .type(user.newUser.username)
      .get(emailField)
      .type(user.newUser.email)
      .get(passwordField)
      .type(user.newUser.password)
      .get(confirmPassField)
      .type(user.newUser.password)
      .get(submitButton)
      .click()
      .then(() => {
        expect(alertStub.notCalled);
        cy.url().should('be.equal', `${Cypress.config("baseUrl")}/`);
      });
  });
});
