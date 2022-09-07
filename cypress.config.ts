import { defineConfig } from 'cypress';
import { configurePlugin } from 'cypress-mongodb';

export default defineConfig({
  env: {
    mongodb: {
      uri: 'mongodb://localhost:27017',
      database: 'signlab',
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
