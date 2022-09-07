describe('User Login', () => {
  before(() => {
    cy.resetDB();
    cy.firstTimeSetup();
  });

  it('should be able to navigate to login page', () => {
    cy.visit('/');

  });
});
