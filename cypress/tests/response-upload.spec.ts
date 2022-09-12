describe('Response Upload', () => {
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
      .get('button[aria-label="Add more responses"]')
      .click()
  });

  it('should open dialog with only the upload button enabled', () => {
    // Upload CSV button should be enabled
    cy
      .get('form>div>button')
      .eq(0)
      .should('not.have.attr', 'disabled');

    // Upload Vidoes button should be disabled
    cy
      .get('form>div>button')
      .eq(1)
      .should('be.disabled');

  });

});
