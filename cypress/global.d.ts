declare namespace Cypress {
  interface Chainable {
    /**
     * Handles making the requests for the first time setup
     */
    firstTimeSetup(): Chainable<any>;
    /**
     * Clear out all data in the database
     */
    resetDB(): Chainable<any>;
  }
}
