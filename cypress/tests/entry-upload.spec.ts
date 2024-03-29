import users from '../fixtures/users.json';

const uploadEntriesButton = '[data-cy="uploadEntriesButton"]';
const uploadCSVButton = '[data-cy="uploadCSVButton"]';
const uploadZIPButton = '[data-cy="uploadZIPButton"]';
const csvFileUploadInput = '[data-cy="csvFileUploadInput"]';
const uploadStatusMessage = '[data-cy="uploadStatusMessage"]';

describe('Upload CSV', () => {
  beforeEach(() => {
    // Clear out any existing data
    cy.resetDB()
      .firstTimeSetup()
      .login(users.existingUser)
      .makeDefaultDataset()
      // Navigate to the entry interface and select the upload option
      .visit('/datasets/dataset-control')
      .get(uploadEntriesButton)
      .click()
  });

  it('should open dialog with only the upload button enabled', () => {
    // Upload CSV button should be enabled
    cy
      .get(uploadCSVButton)
      .should('not.have.attr', 'disabled');

    // Upload Vidoes button should be disabled
    cy
      .get(uploadZIPButton)
      .should('be.disabled');
  });

  it('should produce errors when the filename is not present', () => {
    cy
      .get(csvFileUploadInput)
      .selectFile('cypress/fixtures/entries/missing-filenames.csv', { force: true })
      .get('li')
      .should('contain.text', ('Line 2: Path `filename` is required.'))
      .get(uploadZIPButton)
      .should('be.disabled');
  });

  it('should produce errors on empty csv', () => {
    cy
      .get(csvFileUploadInput)
      .selectFile('cypress/fixtures/entries/empty.csv', { force: true })
      .get(uploadStatusMessage)
      .should('contain.text', 'No entries found in CSV')
      .get(uploadZIPButton)
      .should('be.disabled');
  });

  it('should produce errors on CSV with only a header', () => {
    cy
      .get(csvFileUploadInput)
      .selectFile('cypress/fixtures/entries/only-headers.csv', { force: true })
      .get(uploadStatusMessage)
      .should('contain.text', 'No entries found in CSV')
      .get(uploadZIPButton)
      .should('be.disabled');
  });

  it('should produce errors on CSV with a row that is missing a filename', () => {
    cy
      .get(csvFileUploadInput)
      .selectFile('cypress/fixtures/entries/missing-filename.csv', { force: true })
      .get('li')
      .should('contain.text', 'Line 4: Path `filename` is required.')
      .get(uploadZIPButton)
      .should('be.disabled');
  });

  it('should allow uploading of valid CSV', () => {
    cy
      .get(csvFileUploadInput)
      .selectFile('cypress/fixtures/entries/small-set.csv', { force: true })
      .get(uploadZIPButton)
      .should('not.be.disabled');
  });
});

// TODO: Uncomment once ability to get datasets triggered manually is added
/*
describe('Upload Entry ZIP', () => {
  beforeEach(() => {
    // Clear out any existing data
    cy.resetDB()
      .firstTimeSetup()
      .login(users.existingUser)
      .makeDefaultDataset()
      .visit('/datasets/dataset-control')
      .get(uploadEntriesButton)
      .click()
      // Select the first dataset
      .get(datasetSelect)
      .click()
      // Upload a sample CSV
      .get(csvFileUploadInput)
      .selectFile('cypress/fixtures/entries/small-set.csv', { force: true });
  });

  it('should not break if a directory is present', () => {
    cy
      .get(zipFileUploadInput)
      .selectFile('cypress/fixtures/entries/with-directory.zip', { force: true })
      .get('p')
      .should('contain.text', 'successfully');
  });

  it('should produce a warning when not all of the videos have been provided in a zip', () => {
    cy
      .get(zipFileUploadInput)
      .selectFile('cypress/fixtures/entries/small-set-missing.zip', { force: true })
      .get('p')
      .should('contain.text', 'Uploading video files caused warnings');
  });

  it('should produce a warning when the ZIP has extra videos provides', () => {
    cy
      .get(zipFileUploadInput)
      .selectFile('cypress/fixtures/entries/small-set-extra-video.zip', { force: true })
      .get('li')
      .should('contain.text', 'was not found in original CSV');
  });

  it('should produce a warning when the ZIP has a video with an unsupported video type', () => {
    cy
      .get(zipFileUploadInput)
      .selectFile('cypress/fixtures/entries/bad-extension.zip', { force: true })
      .get('li')
      .should('contain.text', 'girl_response-1.bad: File has unsupported type "bad"');
  });
});
*/
