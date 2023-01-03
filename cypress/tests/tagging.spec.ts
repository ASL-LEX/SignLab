import studies from '../fixtures/study.json';
import users from '../fixtures/users.json';


describe('Tagging', () => {


  /**
   * Test the basic process of tagging for a study with basic numeric and
   * string input with a mix of required and optional fields.
   */
  describe('Basic User Tagging Interface', () => {
    beforeEach(() => {
      cy
        .resetDB()
        .firstTimeSetup()
        .login(users.existingUser)
        .makeStudy(studies.noTraining)
        .log(`Study: ${studies.noTraining.study._id}`);
        /*
        .grantTaggingAccess(studies.noTraining.study._id, users.existingUser._id)
        .visit('/tag')
        .get(`[data-cy="${studies.noTraining.study.name}-button"]`)
        .click(); */
    });


    it('should allow a user to tag an entry', () => {

    });

    /*
    it('should not allow a user to submit a tag without required fields', () => {

    });

    it('should allow users to leave out optional fields', () => {

    });

    it('should progress to the next entry to tag after a successful tag', () => {

    });

    it('should handle when no entries are left to tag', () => {

    });
    */
  });
});
