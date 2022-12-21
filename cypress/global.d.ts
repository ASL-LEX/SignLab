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
    /**
     * Make a login request against the backend
     */
    login(user: { username: string, password: string }): Chainable<any>;
    /**
     * Create a new study.
     *
     * The data provided should be `StudyCreation` to work
     */
    makeStudy(studyCreation: any): Chainable<any>;
    /**
     * Signup the given user into the signlab system
     */
    signup(user: any): Chainable<any>;
    /**
     * Make the default dataset
     */
    makeDefaultDataset(): Chainable<any>;
    /**
     * Add a user as a tagger to a study.
     */
    grantTaggingAccess(studyID: string, userID: string): Chainable<any>;
  }
}
