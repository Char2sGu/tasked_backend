// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace NodeJS {
  interface ProcessEnv {
    PORT: string;
    DB_PATH: string;
    SECRET_KEY: string;
    GRAPHQL_FREQUENCY_LIMIT: string;
    GRAPHQL_FREQUENCY_DURATION: string;
    GRAPHQL_COMPLEXITY: string;
    GRAPHQL_DEPTH: string;
    DEBUG: string;
  }
}
