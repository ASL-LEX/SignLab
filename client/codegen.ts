import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: '../server/dist/schema.gql',
  documents: './src/**/*.ts',
  generates: {
    './graphql/generated.ts': {
      plugins: ['typescript', 'typescript-operations', 'typescript-apollo-angular']
    }
  }
}
export default config;
