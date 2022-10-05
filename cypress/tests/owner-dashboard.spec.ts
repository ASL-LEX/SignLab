import { SinonStub } from 'cypress/types/sinon';
import users from '../fixtures/users.json';

describe('OwnerDashboard', () => {
  describe('Ownership Transfer', () => {
    beforeEach(() => {
      cy.resetDB()
        .firstTimeSetup()
        .login(users.existingUser)
        .visit('/owner')
        .get('[data-cy="transferOwnerButton"]')
        .click()
    });

    it('can transfer owner to another account', () => {
      cy.on('window:confirm', () => true);
      cy
        .get(`[data-cy="select-user-${users.nonAdmin.username}"]`)
        .click()
        .wait(100)  // Need some time for the action to complete
        .findOne({ username: users.nonAdmin.username }, { collection: 'users' })
        .then((user: any) => {
          expect(user.roles.owner).to.be.true;
        })
        .findOne({ username: users.existingUser.username }, { collection: 'users' })
        .then((user: any) => {
          expect(user.roles.owner).to.be.false;
        });
    });
  });

  describe('Adding Owner', () => {
    let alertStub: SinonStub;

    beforeEach(() => {
      cy.resetDB()
        .firstTimeSetup()
        .login(users.existingUser)
        .visit('/owner')
        .get('[data-cy="addOwnerButton"]')
        .click()

      alertStub = cy.stub();
      cy.on('window:alert', alertStub);
    });

    it('can add another user as an owner', () => {
      cy.on('window:confirm', () => true);
      cy
        .get(`[data-cy="select-user-${users.nonAdmin.username}"]`)
        .click()
        .wait(100)  // Need some time for the action to complete
        .findOne({ username: users.nonAdmin.username }, { collection: 'users' })
        .then((user: any) => {
          expect(user.roles.owner).to.be.true;
        })
    });

    it('should not let you add more then N number of owners', () => {
      cy.on('window:confirm', () => true);
      cy.signup(users.others[0]);
      cy.signup(users.others[1]);
      cy.signup(users.others[2]);

      cy
        // And an owner (2 / 3)
        .get(`[data-cy="select-user-${users.nonAdmin.username}"]`)
        .click()
        // And another owner (3 / 3)
        .get('[data-cy="addOwnerButton"]')
        .click()
        .get(`[data-cy="select-user-${users.others[0].username}"]`)
        .click()
        // Attempt to add too many users
        .get('[data-cy="addOwnerButton"]')
        .click()
        .get(`[data-cy="select-user-${users.others[1].username}"]`)
        .click()
        .and(() => {
          expect(alertStub.getCall(0)).to.be.calledWith('There are already a maximum number of owners');
        });
    });
  });
});
