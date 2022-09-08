import { defineConfig } from 'cypress';
import { configurePlugin } from 'cypress-mongodb';
import * as dotenv from 'dotenv';

// Try to read environment file
if (process.env.NODE_ENV) {
  dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
}

const mongoUri = process.env.MONGO_URI!.substring(0, process.env.MONGO_URI!.lastIndexOf('/'));
const databaseName = process.env.MONGO_URI!.substring(process.env.MONGO_URI!.lastIndexOf('/') + 1);


export default defineConfig({
  env: {
    mongodb: {
      uri: mongoUri,
      database: databaseName
    },
  },
  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/tests/**/*.spec.{js,jsx,ts,tsx}',
    setupNodeEvents(on) {
      configurePlugin(on);
    }
  },
});
