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

Cypress.Commands.add('login', (user: { username: string, password: string }) => {
  // Make the login request and insert into local storage
  console.log(user);
  cy
    .request({
      method: 'POST',
      url: 'api/auth/login',
      body: { username: user.username, password: user.password }
    })
    .then(response => {
      Cypress.env('token', response.body.token);
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

  // Make the initial user and a non-admin user
  cy
    .request({
      method: 'POST',
      url: 'api/auth/signup',
      body: user.existingUser
    })
    .request({
      method: 'POST',
      url: 'api/auth/signup',
      body: user.nonAdmin
    });
});

Cypress.Commands.add('makeStudy', (studyCreation: any) => {
  const authorization = `Bearer ${Cypress.env('token')}`;
  cy.request({
    method: 'POST',
    url: 'api/study/create',
    body: studyCreation,
    headers: { authorization }
  });
});
