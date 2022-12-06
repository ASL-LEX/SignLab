import studies from '../fixtures/study.json';
import users from '../fixtures/users.json';

describe('Tagging Landing Page', () => {
  before(() => {
    cy.resetDB();
    cy.firstTimeSetup();

    cy
      .login(users.existingUser)
      .makeStudy(studies.noTraining)
      .login(users.nonAdmin)
      .visit('/tag');
  });

  it('should default to the first study', () => {
    cy
      .get(`[data-cy="${studies.noTraining.study.name}-button"]`)
      .click()
      .get('mat-card-title')
      .should('contain.text', `Study: ${studies.noTraining.study.name}`);
  });
});
