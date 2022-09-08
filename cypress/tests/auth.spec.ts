import { SinonStub } from 'cypress/types/sinon';
import user from '../fixtures/users.json';

describe('User Login', () => {
  // Used for checking alert messages
  let alertStub: SinonStub;

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
      .get('button')
      .contains('Submit')
      .click()
      .then(() => {
        expect(alertStub.getCall(0)).to.be.calledWith('Please enter username and password');
      });
  });

  it('should get an alert when only submitting with username', () => {
    cy.visit('/auth');
    cy
      .get('input#username')
      .type(user.existingUser.username)
      .get('button')
      .contains('Submit')
      .click()
      .then(() => {
        expect(alertStub.getCall(0)).to.be.calledWith('Please enter username and password');
      });
  });

  it('should get an alert when only submitting with password', () => {
    cy.visit('/auth');
    cy
      .get('input#password')
      .type(user.existingUser.password)
      .get('button')
      .contains('Submit')
      .click()
      .then(() => {
        expect(alertStub.getCall(0)).to.be.calledWith('Please enter username and password');
      });
  });

  it('should fail on incorrect username + incorrect password', () => {
    cy.visit('/auth');
    cy
      .get('input#username')
      .type('wrong')
      .get('input#password')
      .type('wrong')
      .get('button')
      .contains('Submit')
      .click()
      .then(() => {
        expect(alertStub.getCall(0)).to.be.calledWith('Username or password is invalid');
      });
  });

  it('should fail on incorrect username + correct pasword', () => {
    cy.visit('/auth');

    cy
      .get('input#username')
      .type('wrong')
      .get('input#password')
      .type(user.existingUser.password)
      .get('button')
      .contains('Submit')
      .click()
      .then(() => {
        expect(alertStub.getCall(0)).to.be.calledWith('Username or password is invalid');
      });
  });

  it('should fail on correct username + incorrect pasword', () => {
    cy.visit('/auth');

    cy
      .get('input#username')
      .type(user.existingUser.username)
      .get('input#password')
      .type('wrong')
      .get('button')
      .contains('Submit')
      .click()
      .then(() => {
        expect(alertStub.getCall(0)).to.be.calledWith('Username or password is invalid');
      });
  });

  it('should work on correct username + correct pasword', () => {
    cy.visit('/auth');

    cy
      .get('input#username')
      .type(user.existingUser.username)
      .get('input#password')
      .type(user.existingUser.password)
      .get('button')
      .contains('Submit')
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

  before(() => {
    cy.resetDB();
    cy.firstTimeSetup();
  });

  beforeEach(() => {
    alertStub = cy.stub();
    cy.on('window:alert', alertStub);

    cy.visit('/auth');
    cy
      .get('div[role="tab"]')
      .contains('Signup')
      .click();

    // Wait for animation to complete
    cy.wait(100);
  });

  it('should not allow signing up with empty form', () => {
    cy
      .get('button[type="submit"')
      .should('be.disabled');
  });

  it('should not submit with a missing name', () => {
    cy
      .get('input#email')
      .type(user.newUser.email)
      .get('input#username')
      .eq(1)
      .type(user.existingUser.username)
      .get('input[type="password"]')
      .eq(0)
      .type(user.existingUser.password)
      .get('input[type="password"')
      .eq(1)
      .type(user.existingUser.password)
      .get('button[type="submit')
      .should('be.disabled');
  });

  it('should not submit with a missing email', () => {
    cy
      .get('input#name')
      .type(user.newUser.name)
      .get('input#username')
      .eq(1)
      .type(user.newUser.username)
      .get('input[type="password"]')
      .eq(0)
      .type(user.newUser.password)
      .get('input[type="password"')
      .eq(1)
      .type(user.newUser.password)
      .get('button[type="submit')
      .should('be.disabled');
  });

  it('should not submit with a missing username', () => {
    cy
      .get('input#name')
      .type(user.newUser.name)
      .get('input#email')
      .type(user.newUser.email)
      .get('input[type="password"]')
      .eq(0)
      .type(user.newUser.password, { force: true })
      .get('input#confirmPassword')
      .type(user.newUser.password)
      .get('button[type="submit')
      .should('be.disabled');
  });

  it('should not submit with a missing password', () => {
    cy
      .get('input#name')
      .type(user.newUser.name)
      .get('input#username')
      .eq(1)
      .type(user.newUser.username)
      .get('input#email')
      .type(user.newUser.email)
      .get('input[type="password"]')
      .eq(1)
      .type(user.newUser.password)
      .get('button[type="submit')
      .should('be.disabled');
  });

  it('should not submit with a missing confirm password', () => {
    cy
      .get('input#name')
      .type(user.newUser.name)
      .get('input#username')
      .eq(1)
      .type(user.newUser.username)
      .get('input#email')
      .type(user.newUser.email)
      .get('input[type="password"')
      .eq(0)
      .type(user.newUser.password)
      .get('button[type="submit')
      .should('be.disabled');
  });

  it('should not submit with a non-matching passwords', () => {
    cy
      .get('input#name')
      .type(user.newUser.name)
      .get('input#username')
      .eq(1)
      .type(user.newUser.username)
      .get('input#email')
      .type(user.newUser.email)
      .get('input[type="password"')
      .eq(0)
      .type(user.newUser.password)
      .get('input[type="password"')
      .eq(1)
      .type(user.newUser.password + 'something else')
      .get('button[type="submit')
      .should('be.disabled');
  });

  it('should get alert with using existing username + email', () => {
    cy
      .get('input#name')
      .type(user.newUser.name)
      .get('input#username')
      .eq(1)
      .type(user.existingUser.username)
      .get('input#email')
      .type(user.existingUser.email)
      .get('input[type="password"')
      .eq(0)
      .type(user.newUser.password)
      .get('input[type="password"')
      .eq(1)
      .type(user.newUser.password)
      .get('button[type="submit')
      .click()
      .then(() => {
        expect(alertStub.getCall(0)).to.be.calledWith(`${user.existingUser.username} is not an available username\n${user.existingUser.email} is not an available email`);
      });
  });

  it('should get alert with using existing username', () => {
    cy
      .get('input#name')
      .type(user.newUser.name)
      .get('input#username')
      .eq(1)
      .type(user.existingUser.username)
      .get('input#email')
      .type(user.newUser.email)
      .get('input[type="password"')
      .eq(0)
      .type(user.newUser.password)
      .get('input[type="password"')
      .eq(1)
      .type(user.newUser.password)
      .get('button[type="submit')
      .click()
      .then(() => {
        expect(alertStub.getCall(0)).to.be.calledWith(`${user.existingUser.username} is not an available username\n`);
      });
  });

  it('should get alert with using existing email', () => {
    cy
      .get('input#name')
      .type(user.newUser.name)
      .get('input#username')
      .eq(1)
      .type(user.newUser.username)
      .get('input#email')
      .type(user.existingUser.email)
      .get('input[type="password"')
      .eq(0)
      .type(user.newUser.password)
      .get('input[type="password"')
      .eq(1)
      .type(user.newUser.password)
      .get('button[type="submit"]')
      .click()
      .then(() => {
        expect(alertStub.getCall(0)).to.be.calledWith(`${user.existingUser.email} is not an available email`);
      });
  });

  it('should submit with valid information', () => {
    cy
      .get('input#name')
      .type(user.newUser.name)
      .get('input#username')
      .eq(1)
      .type(user.newUser.username)
      .get('input#email')
      .type(user.newUser.email)
      .get('input[type="password"')
      .eq(0)
      .type(user.newUser.password)
      .get('input[type="password"')
      .eq(1)
      .type(user.newUser.password)
      .get('button[type="submit"]')
      .click()
      .then(() => {
        expect(alertStub.notCalled);
        cy.url().should('be.equal', `${Cypress.config("baseUrl")}/`);
      });
  });
});
