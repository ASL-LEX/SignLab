import entryMetadata from '../fixtures/entry_metadata.json';
import user from '../fixtures/users.json';
import { UserSignup } from '../../shared/dtos/user.dto';

Cypress.Commands.add('resetDB', () => {
  cy.deleteMany({}, { collection: 'dynamicschemas' });
  cy.deleteMany({}, { collection: 'entries' });
  cy.deleteMany({}, { collection: 'entriestudies' });
  cy.deleteMany({}, { collection: 'entryuploads' });
  cy.deleteMany({}, { collection: 'studies' });
  cy.deleteMany({}, { collection: 'tags' });
  cy.deleteMany({}, { collection: 'users' });
  cy.deleteMany({}, { collection: 'userstudies' });
  cy.deleteMany({}, { collection: 'usercredentials' });
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
    .then(entry => {
      Cypress.env('token', entry.body.token);
      window.localStorage.setItem('SIGNLAB_AUTH_INFO', JSON.stringify(entry.body));
    });
});

Cypress.Commands.add('firstTimeSetup', () => {
  // Submit the expected meta data
  cy.request({
    method: 'POST',
    url: 'api/entry/metadata',
    body: entryMetadata
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

Cypress.Commands.add('signup', (user: UserSignup) => {
  cy
    .request({
      method: 'POST',
      url: 'api/auth/signup',
      body: user
    })
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
