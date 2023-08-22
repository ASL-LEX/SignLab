/*
 * Utility script which makes the environment files. This is an approach
 * different from the normal method of using angular to replace the
 * environment files.
 *
 * The script will use dotenv to load in settings from the environment and
 * store the results in an environment file.
 *
 * This was adapted from the following article
 * https://ferie.medium.com/how-to-pass-environment-variables-at-building-time-in-an-angular-application-using-env-files-4ae1a80383c
 */
const fs = require('fs/promises');
require('dotenv').config();

const saveEnvironmentFile = async () => {
  // Make the config in the format of a regular Angular environment file
  const envConfigFileContent = `
    export const environment = {
      production: '${process.env.PRODUCTION || false}',
      graphqlEndpoint: '${process.env.GRAPHQL_ENDPOINT}',
      aslLexID: '${process.env.ASL_LEX_ID}'
    };
  `;

  // Save the file
  const environmentFilePath = './src/environments/environment.ts';

  await fs.writeFile(environmentFilePath, envConfigFileContent);
};

saveEnvironmentFile();
