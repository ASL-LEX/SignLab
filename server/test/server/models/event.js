'use strict';

const Event = require('../../../src/models/event');
const Code = require('code');
const Config = require('../../../config');
const Fixtures = require('../fixtures');
const Lab = require('@hapi/lab');


const lab = exports.lab = Lab.script();
const config = Config.get('/hapiAnchorModel/mongodb');

lab.experiment('Event Model', () => {

  lab.before(async () => {

    await Event.connect(config.connection,config.options);
    await Fixtures.Db.removeAllData();
  });

  lab.after(async () => {

    await Fixtures.Db.removeAllData();

    Event.disconnect();
  });

  lab.test('it returns a new instance when create succeeds', async () => {

    const event = await Event.create({ name: 'eventName', userId: 'userID' });
    Code.expect(event).to.be.an.instanceOf(Event);

  });
});
