import responseMetadata from '../fixtures/response_metadata.json';
import user from '../fixtures/login.json';

Cypress.Commands.add('resetDB', () => {
  cy.deleteMany({}, { collection: 'dynamicschemas' });
  cy.deleteMany({}, { collection: 'responses' });
  cy.deleteMany({}, { collection: 'responsestudies' });
  cy.deleteMany({}, { collection: 'responseuploads' });
  cy.deleteMany({}, { collection: 'studies' });
  cy.deleteMany({}, { collection: 'tags' });
  cy.deleteMany({}, { collection: 'users' });
  cy.deleteMany({}, { collection: 'userstudies' });
});

Cypress.Commands.add('firstTimeSetup', () => {
  // Submit the expected meta data
  cy.request({
    method: 'POST',
    url: 'api/response/metadata',
    body: responseMetadata
  });

  // Make the initial user
  cy.request({
    method: 'POST',
    url: 'api/auth/signup',
    body: user
  });
});
