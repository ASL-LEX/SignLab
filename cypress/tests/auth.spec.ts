import { SinonStub } from 'cypress/types/sinon';
import user from '../fixtures/login.json';

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
      .type(user.username)
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
      .type(user.password)
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
      .type(user.password)
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
      .type(user.username)
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
      .type(user.username)
      .get('input#password')
      .type(user.password)
      .get('button')
      .contains('Submit')
      .click()
      .then(() => {
        expect(alertStub.notCalled);
        cy.url().should('be.equal', `${Cypress.config("baseUrl")}/`);
      });
  });
});
