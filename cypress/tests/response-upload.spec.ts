describe('Response Upload', () => {

  const uploadResponsesButton = '[data-cy="uploadResponsesButton"]';
  const uploadCSVButton = '[data-cy="uploadCSVButton"]';
  const uploadZIPButton = '[data-cy="uploadZIPButton"]';
  const csvFileUploadInput = '[data-cy="csvFileUploadInput"]';

  before(() => {
    // Clear out any existing data
    cy.resetDB();
    cy.firstTimeSetup();
  });

  beforeEach(() => {
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
      .should('have.text', ('Line 2: Path `filename` is required.\n'));
  });

});
