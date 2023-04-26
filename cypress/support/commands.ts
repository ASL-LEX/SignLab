import entryMetadata from '../fixtures/entry_metadata.json';
import user from '../fixtures/users.json';
import datasets from '../fixtures/datasets.json';
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
  cy.deleteMany({}, { collection: 'datasets' });
  cy.deleteMany({}, { collection: 'organizations' })
});

Cypress.Commands.add('login', (user: { username: string, password: string }) => {
  // Make the login request and insert into local storage
  cy
    .request({
      method: 'POST',
      url: 'graphql',
      body: {
        query: `mutation login($credentials: UserCredentials!) {
          login(credentials: $credentials) {
            token,
            user {
              _id,
              username,
              email,
              roles
            }
          }
        }`,
        variables: {
          credentials: { username: user.username, password: user.password, organization: window.localStorage.getItem('org') },
        }
      }
    })
    .then(entry => {
      Cypress.env('token', entry.body.token);
      const auth = { token: entry.body.data.login.token, user: entry.body.data.login.user };
      window.localStorage.setItem('SIGNLAB_AUTH_INFO', JSON.stringify(auth));
    });
});

Cypress.Commands.add('makeDefaultOrganization', () => {
  cy
    .request({
      method: 'POST',
      url: 'graphql',
      body: {
        query: `mutation createOrganization($orgCreate: OrganizationCreate!) {
          createOrganization(orgCreate: $orgCreate) {
            _id,
            name
          }
        }`,
        variables: {
          orgCreate: { name: 'ASL-LEX' }
        }
      }
    }).then(org => {
      window.localStorage.setItem('org', org.body.data.createOrganization._id)
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
    .makeDefaultOrganization()
    .signup(user.existingUser)
    .signup(user.nonAdmin);

  // Add in a starting dataset
});

Cypress.Commands.add('signup', (user: UserSignup) => {
  const credentials: UserSignup = { ...user };
  credentials.organization = window.localStorage.getItem('org');
  cy
    .request({
      method: 'POST',
      url: 'graphql',
      body: {
        query: `mutation signup($credentials: UserSignup!) {
          signup(credentials: $credentials) {
            token,
            user {
              _id,
              username,
              email,
              roles
            }
          }
        }`,
        variables: {
          credentials: credentials
        }
      }
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

Cypress.Commands.add('makeDefaultDataset', () => {
  const dataset = datasets.existingDataset;
  dataset.creator = JSON.parse(localStorage.getItem('SIGNLAB_AUTH_INFO')!).user._id;

  cy.request({
    method: 'POST',
    url: 'graphql',
    body: {
      query: `mutation createDataset($datasetCreate: DatasetCreate!) {
        createDataset(datasetCreate: $datasetCreate) {
          id
        }
      }`,
      variables: {
        datasetCreate: {
          name: dataset.name,
          description: dataset.description,
          creatorID: (dataset.creator as any),
          organization: window.localStorage.getItem('org')
        }
      }
    },
  });
});
