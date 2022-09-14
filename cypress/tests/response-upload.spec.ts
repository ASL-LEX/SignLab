const uploadResponsesButton = '[data-cy="uploadResponsesButton"]';
const uploadCSVButton = '[data-cy="uploadCSVButton"]';
const uploadZIPButton = '[data-cy="uploadZIPButton"]';
const csvFileUploadInput = '[data-cy="csvFileUploadInput"]';
const uploadStatusMessage = '[data-cy="uploadStatusMessage"]';
const zipFileUploadInput = '[data-cy="zipFileUploadInput"]';

describe('Upload CSV', () => {
  beforeEach(() => {
    // Clear out any existing data
    cy.resetDB();
    cy.firstTimeSetup();

    // Navigate to the response interface and select the upload option
    cy
      .login()
      .visit('/admin')
      .get('div[class="mat-tab-label-content"]')
      .contains('Responses')
      .click()
      .wait(100)
      .get(uploadResponsesButton)
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
      .selectFile('cypress/fixtures/responses/missing-filenames.csv', { force: true })
      .get('li')
      .should('contain.text', ('Line 2: Path `filename` is required.'))
      .get(uploadZIPButton)
      .should('be.disabled');
  });

  it('should produce when the user expected field is not present', () => {
    // NOTE: This field is added using the `cy.firstTimeSetup()` call

    cy
      .get(csvFileUploadInput)
      .selectFile('cypress/fixtures/responses/missing-user-fields.csv', { force: true })
      .get('li')
      .should('contain.text', 'Line 2: requires property "prompt"')
      .get(uploadZIPButton)
      .should('be.disabled');
  });

  it('should produce errors on empty csv', () => {
    cy
      .get(csvFileUploadInput)
      .selectFile('cypress/fixtures/responses/empty.csv', { force: true })
      .get(uploadStatusMessage)
      .should('contain.text', 'No responses found in CSV')
      .get(uploadZIPButton)
      .should('be.disabled');
  });

  it('should produce errors on CSV with only a header', () => {
    cy
      .get(csvFileUploadInput)
      .selectFile('cypress/fixtures/responses/only-headers.csv', { force: true })
      .get(uploadStatusMessage)
      .should('contain.text', 'No responses found in CSV')
      .get(uploadZIPButton)
      .should('be.disabled');
  });

  it('should produce errors on CSV with a row that is missing a filename', () => {
    cy
      .get(csvFileUploadInput)
      .selectFile('cypress/fixtures/responses/missing-filename.csv', { force: true })
      .get('li')
      .should('contain.text', 'Line 4: Path `filename` is required.')
      .get(uploadZIPButton)
      .should('be.disabled');
  });

  it('should allow uploading of valid CSV', () => {
    cy
      .get(csvFileUploadInput)
      .selectFile('cypress/fixtures/responses/small-set.csv', { force: true })
      .get(uploadZIPButton)
      .should('not.be.disabled');
  });
});

describe('Upload Response ZIP', () => {
  beforeEach(() => {
    // Clear out any existing data
    cy.resetDB();
    cy.firstTimeSetup();

    // Navigate to the response interface and select the upload option
    // then upload the small dataset
    cy
      .login()
      .visit('/admin')
      .get('div[class="mat-tab-label-content"]')
      .contains('Responses')
      .click()
      .wait(100)
      .get(uploadResponsesButton)
      .click()
      .get(csvFileUploadInput)
      .selectFile('cypress/fixtures/responses/small-set.csv', { force: true })
  });

  // TODO: Uncomment once the bug associating with uploading empty zip
  //       files has been addressed
  /*
  it('should warn when nothing in zip folder', () => {
    cy
      .get(zipFileUploadInput)
      .selectFile('cypress/fixtures/responses/empty.zip', { force: true })
      .get('li');
  });
  */

  // TODO: Uncomment once the bug associated with no warnings being displayed
  //       if the user is missing a video in the ZIP has been addressed
  /*
  it('should produce a warning when not all of the videos have been provided in a zip', () => {
    cy
      .get(zipFileUploadInput)
      .selectFile('cypress/fixtures/responses/small-set-missing.zip', { force: true })
      .get('li')
      .should('contain.text', 'hi');
  });
  */
});
