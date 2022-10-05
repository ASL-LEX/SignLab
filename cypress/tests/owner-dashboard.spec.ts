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
    beforeEach(() => {
      cy.resetDB()
        .firstTimeSetup()
        .login(users.existingUser)
        .visit('/owner')
        .get('[data-cy="addOwnerButton"]')
        .click()
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
  });
});
