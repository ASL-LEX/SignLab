const yargs = require('yargs');
const User = require('../server/models/user.js');
const cmd_prompt = require('prompt-sync')();
const config = require('../config');

yargs
  .command({
    command: 'make <username> <password> <email> <name>',
    desc: 'Make a new user',
    handler: async (argv) => {
      // Print out the user details to verify
      console.log('New user details');
      console.log(`\tUsername: ${argv.username}`);
      console.log(`\tPassword: ${argv.password}`);
      console.log(`\tEmail: ${argv.email}`);
      console.log(`\tName: ${argv.name}`);

      // Ensure the user still wants to make the user
      const user_answer = cmd_prompt('Make user? (Y/n)');
      if(user_answer != '' || user_answer.toLowerCase() == 'n') {
        console.log('Canceling...');
        return;
      }
      // Create the new user
      await User.connect({ uri: config.get('/hapiMongoModels/mongodb/uri'), db: 'anchor'})
      const user = await User.create(argv.username, argv.password, argv.email, argv.name);
      console.log(`Created new user: ${user}`);
      return;
    }
  })
  .demandCommand()
  .argv;
