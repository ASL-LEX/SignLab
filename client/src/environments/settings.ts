export interface EnvironmentSettings {
  production: boolean;
  /** GraphQL endpoint to make requests against */
  graphqlEndpoint: string;
  /** The Lexicon ID (defined by the Lexicon Service) of the ASL-LEX lexicon */
  aslLexID: string;
}
