'use strict';
const Glue = require('@hapi/glue');
const Manifest = require('./manifest');
const InitPC = require('./server/helper/initPermissionConfigFile');
const Fs = require('fs');

process.on('unhandledRejection', (reason, promise) => {

  console.error(`Unhandled Rejection at: ${promise} reason: ${reason}`);
  console.log(promise);
});

const main = async function () {

  const options = { relativeTo: __dirname };
  const server = await Glue.compose(Manifest.get('/'), options);

  await server.start();

  if (!Fs.existsSync('server/permission-config.json')){
    InitPC(server);
  }

  console.log(`Server started on port ${Manifest.get('/server/port')}`);
};

main();
