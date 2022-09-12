import responseMetadata from '../fixtures/response_metadata.json';
import user from '../fixtures/users.json';

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

Cypress.Commands.add('login', () => {
  // Make the login request and insert into local storage
  cy
    .request({
      method: 'POST',
      url: 'api/auth/login',
      body: { username: user.existingUser.username, password: user.existingUser.password }
    })
    .then(response => {
      window.localStorage.setItem('SIGNLAB_AUTH_INFO', JSON.stringify(response.body));
    });
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
    body: user.existingUser
  });
});
